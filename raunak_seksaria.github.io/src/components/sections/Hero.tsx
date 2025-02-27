const Hero = () => {
    return (
        <div id="beginning" className="bg-[var(--bgHead)] p-4 md:p-8">
            <div id="start" className="font-lato uppercase px-4 md:px-[30%] pt-12 text-[3vw] md:text-[80%] text-[var(--bgLight4)] text-center">
                A personal Portfolio Website
                <hr id="customLine" className="w-1/2 md:w-1/5 mx-auto" />
            </div>
            <div id="name" className="text-[8vw] md:text-[10rem] text-[var(--bgLight4)] px-4 md:px-[30%] font-roboto-mono text-center">
                R<span id="differentColorName" className="text-[var(--bgHeader)]">au</span>nak.
            </div>
            <div id="shortIntro" className="font-courier-new text-[4vw] md:text-[1.3rem] font-medium pb-16 md:pb-[70vh] flex justify-center text-center text-[var(--bgLight4)]">
                Programmer, Full-Stack Developer,<br /> Tech and AI/ML Enthusiast.
            </div>
        </div>
    );
};

export default Hero;
