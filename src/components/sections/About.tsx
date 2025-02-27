const About = () => {
    return (
        <div id="about" className="text-[var(--textLight1)] bg-[var(--bgLight2)] flex flex-col md:flex-row justify-between p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">About Me</h2>
                <span id="descriptionAbout" className="relative text-center md:text-left">
                    A fresher at IIIT-Hyderabad, I am interested in the fields of Math and Computer
                    Science. I am also a tech geek, programmer, and front end developer. A cinephile, I dream to someday direct
                    a short film of my own. I am also into photography and public speaking.
                </span><br />
            </div>
        </div>
    );
};

export default About;
