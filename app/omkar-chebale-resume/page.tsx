export default function Home() {
    return(
        <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900">
            <iframe
                src="/omkar_chebale_resume.pdf"
                className="w-full h-screen"
                style={{ border: 'none' }}
            />
        </div>
    )
}