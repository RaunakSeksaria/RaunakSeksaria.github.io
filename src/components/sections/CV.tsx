const CV = () => {
    return (
        <div id="cv" className="text-[var(--textLight1)] bg-[var(--bgLight3)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Curriculum Vitae</h2>
                <div className="flex flex-col items-center md:items-start space-y-6">
                    <p className="text-center md:text-left text-lg">Download my complete CV to learn more about my experience and qualifications.</p>
                    <a href="/Raunak_Seksaria_CV.pdf" download 
                       className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium rounded-lg bg-gradient-to-r from-[var(--bgLight4)] to-[var(--bgHeader)] text-[var(--bgLight1)] shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                        <span className="absolute inset-0 w-full h-full transition duration-300 ease-out transform -translate-x-full bg-[var(--bgLight2)] group-hover:translate-x-0"></span>
                        <span className="relative flex items-center">
                            Download CV
                            <svg className="w-5 h-5 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-y-1" 
                                 fill="none" 
                                 stroke="currentColor" 
                                 viewBox="0 0 24 24" 
                                 xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      strokeWidth="2" 
                                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4">
                                </path>
                            </svg>
                        </span>
                    </a>
                    <p className="text-sm text-[var(--textLight1)] opacity-75 mt-4">Click to download in PDF format</p>
                </div>
            </div>
        </div>
    );
};

export default CV;
