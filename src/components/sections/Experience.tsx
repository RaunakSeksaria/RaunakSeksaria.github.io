const Experience = () => {
    return (
        <div id="experience" className="text-[var(--textLight1)] bg-[var(--bgLight2)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Experience</h2>
                <ul className="list-disc ml-5 space-y-4 text-left">
                    <li>
                        <strong>Dual Degree Researcher</strong> - <em>Centre for Computational Natural Sciences and Bioinformatics, IIIT-H</em> <em>(May 2025 - Ongoing)</em>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>
                                Working with Prof. Chittaranjan Hens on perturbative and resilience analysis for
                                complex, geopolitical, and financial networks, including signed graphs and higher-order
                                interactions in simplicial complexes and hypergraphs.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <strong>Teaching Assistant - Discrete Structures</strong> - IIIT Hyderabad <em>(Aug 2025 - Dec 2025)</em>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>
                                Conducted tutorials and graded assignments and exams for a 275+ student Discrete
                                Structures course.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <strong>Software Developer Intern</strong> - <em>Product Labs, IIIT-H</em> <em>(May 2025 - June 2025)</em>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>
                                Developed the MVP for software that ingests real-time YouTube livestream data and
                                presents audio output in regional languages.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <strong>Team Lead</strong> - <em>Parent Diaries, associated with startup HopeLog</em> <em>(Jan 2025 - Apr 2025)</em>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>
                                Led development of a deployed cross-platform MERN + React Native app with multilingual
                                speech chat using OpenAI APIs.
                            </li>
                            <li>
                                Implemented AI-based milestone tracking, WSS-powered chat systems, vaccination and
                                growth tracking, and a parent discussion forum.
                            </li>
                        </ul>
                    </li>

                    <li>
                        <strong>Co-founder</strong> - <em>Katran (Onaya Foundation)</em> <em>(Dec 2020 - Mar 2023)</em>
                        <ul className="list-disc ml-5 mt-2 space-y-2">
                            <li>
                                Upcycled 10000m+ waste fabric, distributed 8000+ dresses to marginalized children, and
                                uplifted 40+ marginalized artisans.
                            </li>
                            <li>
                                Helped raise INR 3+ lakh and organized 15+ fundraising events, including debate,
                                extempore, and nationwide plantation drives.
                            </li>
                            <li>
                                Featured in 12+ publications, including The India Times, The Telegraph, The Better
                                India, and Global Indian.
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Experience;