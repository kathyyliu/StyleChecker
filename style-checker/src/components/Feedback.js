

function Feedback(props) {

    function buildMessage(id) {
        const ex = props.examples[id];
        return `${ex.rationale}
        Bad example: ${ex.bad}
        Good example: ${ex.good}`;
    }

    const feedbackList = [];
    props.warnings.sort((a, b) => a.line < b.line);

    props.warnings.forEach((warning, i) => {
        const collapseId = "collapse" + i.toString();

        feedbackList.push(
        <div className="accordion-item bg-white border border-gray-200" key={i}>
            <h2 className="accordion-header mb-0">
                <button className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white
                    border-0 rounded-none transition focus:outline-none" 
                    type="button" data-bs-toggle="collapse" data-bs-target={"#" + collapseId} aria-expanded="false" aria-controls={"#" + collapseId}>
                    Line {warning.line}: {warning.message}
                </button>
            </h2>
            <div id={collapseId} className="accordion-collapse collapse show"
            data-bs-parent="#warningsAccordion">
                <div className="accordion-body py-4 px-5 whitespace-pre-wrap text-left">
                    {buildMessage(warning["message-id"])}
                </div>
            </div>
        </div>);
        
    });

    return (
        <div className="accordion flex-initial" id="warningsAccordion">
            {feedbackList}
        </div>
    );
}

export default Feedback;