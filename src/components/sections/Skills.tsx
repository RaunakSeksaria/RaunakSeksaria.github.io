const Skills = () => {
    return (
        <div id="skills" className="text-[var(--textLight1)] bg-[var(--bgLight3)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Skills</h2>
                <ul id="SkillList" className="list-disc ml-5 space-y-4 text-left">
                    <li>Technical Skills:
                        <ul className="list-disc ml-5 space-y-2">
                            <li>Programming Languages: Python, C++, C, JavaScript, Java, SQL</li>
                            <li>Tools: Git, Linux CLI, Shell Scripting, Jupyter Notebook</li>
                            <li>Libraries & Frameworks: Numpy, Matplotlib, Networkx, TensorFlow, Scikit-learn, Pandas, Flask, Next.js, Tailwind, SQLite</li>
                            <li>Other: Computational Modelling, Graph Theory, Data Visualization, Machine Learning, Quantum Mechanics</li>
                        </ul>
                    </li>
                    <li>Management :
                        <ul className="list-disc ml-5 space-y-2">
                            <li>Co-Founder of a student-led NPO, Katran Foundation</li>
                            <li>Leadership Roles at St. James' School:
                                <ul className="list-disc ml-5 space-y-2">
                                    <li>Student Council Member and School Prefect</li>
                                    <li>Secretary, Mathematics Club</li>
                                    <li>Director, Science Club</li>
                                    <li>Director, Model United Nations (MUN) Society</li>
                                    <li>Helped organizing inter and intra school events</li>
                                </ul>
                            </li>
                            <li>Clubs and Societies at IIIT-H:
                                <ul className="list-disc ml-5 space-y-2">
                                    <li>Member, Pentaprism: The Photography Club ('23,'24)</li>
                                    <li>Member, Programming Club ('24)</li>
                                    <li>Member, Cyclorama: The Film Club ('24)</li>
                                    <li>Member, Ping-IIIT: Independent Student Media Body ('24)</li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li>Musical Instruments Played: Keyboard, Piano, Guitar, Ukulele</li>
                    <li>Public Speaking : Debate, Model United Nation(MUN), Elocution</li>
                </ul>
            </div>
        </div>
    );
};

export default Skills;
