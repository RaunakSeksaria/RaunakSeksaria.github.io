const Achievements = () => {
    return (
        <div id="achievements" className="text-[var(--textLight1)] bg-[var(--bgLight2)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Achievements:</h2>
                <ul id="AchievementsList" className="space-y-2 list-disc ml-5 text-left">
                    <li>Dean's List 2: Spring'24 semester</li>
                    <li>Dean's List 3: Monsoon'24 semester</li>
                    <li>The Bishop's Medal for Academic Excellence (School Topper in ISC (12th) Board Exam Score - Science Stream) : Issued by St. James' School, Kolkata</li>
                    <li>The Chippendale Award for Creative Writing and Composition : Issued by St. James' School, Kolkata</li>
                    <li>Senior Diploma and Distinction in Art and Painting : Issued by Bangiya Sangit Parishad, Rabindra Bharati University</li>
                </ul>
            </div>
        </div>
    );
};

export default Achievements;
