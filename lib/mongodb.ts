import mongoose from 'mongoose'
import dns from 'node:dns'

// Workaround for some environments (like mobile hotspots) where DNS SRV resolution may fail
try {
  dns.setServers(['8.8.8.8', '1.1.1.1'])
} catch (e) {
  console.warn('Failed to set explicit DNS servers:', e)
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  var mongoose: MongooseCache | undefined
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    // Try normal connection first
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    }).catch(async (err) => {
      // If SRV resolution fails (ECONNREFUSED/ENOTFOUND on querySrv), try manual resolution
      if (MONGODB_URI.startsWith('mongodb+srv://') && (err.code === 'ECONNREFUSED' || err.message.includes('querySrv'))) {
        console.warn('SRV resolution failed. Attempting manual resolution workaround...')
        try {
          const srvParts = MONGODB_URI.replace('mongodb+srv://', '').split('/')
          const [authAndHost, dbNameAndQuery] = srvParts[0].split('/')
          const [auth, host] = authAndHost.split('@')
          const queryParams = srvParts[1] ? srvParts[1] : ''

          // Resolve SRV records manually using a stable DNS
          dns.setServers(['8.8.8.8', '1.1.1.1'])
          const addresses = await new Promise<dns.SrvRecord[]>((resolve, reject) => {
            dns.resolveSrv(`_mongodb._tcp.${host}`, (err, addr) => err ? reject(err) : resolve(addr))
          })

          if (addresses.length > 0) {
            const nodes = addresses.map(a => `${a.name}:${a.port}`).join(',')
            // Construct a standard mongodb:// URI with multiple nodes
            const fallbackUri = `mongodb://${auth}@${nodes}/${srvParts[1] || ''}${srvParts[1]?.includes('?') ? '&' : '?'}ssl=true&authSource=admin`
            console.log('Manual resolution successful. Connecting to:', nodes)
            return mongoose.connect(fallbackUri, opts)
          }
        } catch (srvErr) {
          console.error('Manual SRV resolution failed too:', srvErr)
        }
      }
      throw err // Re-throw if workaround fails or not applicable
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    console.error('Final MongoDB connection attempt failed:', e)
    throw e
  }

  return cached.conn
}
