const Education = () => {
    return (
        <div id="edu" className="text-[var(--textLight1)] bg-[var(--bgLight3)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Educational Background</h2>
                <ol id="eduText" className="list-decimal ml-5 space-y-2 text-left">
                    <li>10th Pass Certificate (ICSE) : <a href="http://stjamesschoolkolkata.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--linkColor)] underline hover:text-[var(--linkHoverColor)]">St. James' School, Kolkata</a></li>
                    <li>High School Diploma (ISC) : <a href="http://stjamesschoolkolkata.com/" target="_blank" rel="noopener noreferrer" className="text-[var(--linkColor)] underline hover:text-[var(--linkHoverColor)]">St. James' School, Kolkata</a></li>
                    <li>Bachelor of Technology in Computer Science and Engineering + Masters in Computational Natural Science (Dual Degree) (ongoing) : <a href="https://www.iiit.ac.in/" target="_blank" rel="noopener noreferrer" className="text-[var(--linkColor)] underline hover:text-[var(--linkHoverColor)]">International Institute of Information Technology, Hyderabad</a></li>
                </ol>
            </div>
        </div>
    );
};

export default Education;
