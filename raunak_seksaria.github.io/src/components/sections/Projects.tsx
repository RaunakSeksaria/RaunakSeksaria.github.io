const Projects = () => {
    return (
        <div id="projects" className="text-[var(--textLight1)] bg-[var(--bgLight2)] p-4 md:p-20">
            <div className="w-full md:w-2/3 p-4 md:p-10">
                <h2 className="w-full font-dancing-script text-2xl md:text-4xl mb-4 text-center md:text-left">Projects</h2>
                <ul className="list-disc ml-5 space-y-4 text-left">
                    <li>
                        <strong>Full Stack Website for Buy, Sell, Rent on College</strong>
                        <p>Developed a MERN Stack website as part of the coursework for 'Design and Analysis of Software Systems'</p>
                    </li>
                    <li>
                        <strong>Protein Interaction Networks (PINs) Report</strong>
                        <p>Focused on Deep Learning advances, specifically GNNs and SVMs for protein interaction prediction</p>
                    </li>
                    <li>
                        <strong>Full Stack Photo-Slideshow Web App</strong>
                        <p>Built using HTML, CSS, JavaScript, Python (Flask, PyJWT, MoviePy, Gunicorn), and SQL</p>
                    </li>
                    <li>
                        <strong>Computational Modeling of Scientific Problems</strong>
                        <p>Implemented various scientific simulations as part of Computing-in-Science-II course:</p>
                        <ul className="list-disc ml-5 space-y-2">
                            <li>Random Walks and Prey-Predator Systems</li>
                            <li>Logistic Map with Steady-State Analysis</li>
                            <li>Monte-Carlo Simulations for Multidimensional Integrals</li>
                            <li>Fourier Analysis using Complex Numbers and Epicycles</li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Projects;
