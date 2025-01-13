import { skills } from '@/utils/data'
import Image from 'next/image'

export const Skills = () => {
    return (
        <section id='skills' className="container mx-auto px-4 py-20 bg-muted/50">
            <h2 className="text-3xl font-bold mb-10 text-center">Skills</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {skills.map((category, index) => (
                    <div key={index} className="bg-card p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-semibold mb-4">{category.title}</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {category.skills.map((skill, skillIndex) => (
                                <div key={skillIndex} className="flex flex-col items-center">
                                    <Image
                                        src={skill.image}
                                        alt={skill.name}
                                        width={40}
                                        height={40}
                                        className="mb-2"
                                    />
                                    <span className="text-sm text-center">{skill.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
