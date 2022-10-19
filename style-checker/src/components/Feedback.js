function Feedback(props) {

    function buildMessage(id) {
        const ex = props.examples[id];
        return (
            <div className="accordion-body py-4 px-5 whitespace-pre-wrap text-left">
                {ex.rationale}<br/>
                <br/><b>Bad example:</b>
                <pre>{" " + ex.bad}</pre>
                <br/><b>Good example:</b>
                <pre>{" " + ex.good}</pre>
            </div>
        );
    }

    const feedbackList = [];
    const sorted_warns = props.warnings.sort((a, b) => parseInt(a.line) - parseInt(b.line));

    sorted_warns.forEach((warning, i) => {
        const collapseId = "collapse" + i.toString();

        feedbackList.push(
        <div className="accordion-item bg-white border border-gray-200" key={i}>
            <h2 className="accordion-header mb-0">
                <button className="accordion-button collapsed relative flex items-center w-full py-4 px-5 text-base text-gray-800 text-left bg-white
                    border-0 rounded-none transition focus:outline-none" 
                    type="button" data-bs-toggle="collapse" data-bs-target={"#" + collapseId} aria-expanded="false" aria-controls={"#" + collapseId}>
                    <p><b>Line {warning.line}: </b>{warning.message}</p>
                </button>
            </h2>
            <div id={collapseId} className="accordion-collapse collapse"
            data-bs-parent="#warningsAccordion">
                {buildMessage(warning["message-id"])}
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