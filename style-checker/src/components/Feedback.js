import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './Feedback.css'


function Feedback(props) {

    Prism.highlightAll();
    // TODO: prevent rerender on code change --> useMemo()?
    function buildMessage(id) {
        const ex = props.examples[id];
        return (
            <div className="accordion-body py-4 px-5 whitespace-pre-wrap text-left">
                {ex.rationale}<br/><br/>
                <b>Bad example:</b>
                <div className="code-snip">
                    <pre><code>{ex.bad}</code></pre>
                </div><br/>    
                <b>Good example:</b>
                <div className="code-snip">
                    <pre><code>{ex.good}</code></pre>
                </div>
            </div>
        );
    }

    const feedbackList = [];
    props.warnings.forEach((warning, i) => {
        const collapseId = "collapse" + i.toString();
        feedbackList.push(
            <div className="language-python accordion-item bg-white border border-gray-200" key={i}>
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
            </div>
        );
    });

    return (
        <div className="accordion flex-initial" id="warningsAccordion">
            {feedbackList}
        </div>
    );
}
    
//     // 21px
//     const warning = props.warnings[0];
//     const msg = <div className="language-python accordion-item bg-white border border-gray-200" key="1">
//             <h2 className="accordion-header mb-0">
//                 <button className="accordion-button collapsed relative flex items-center w-full py-2 px-5 text-base text-gray-800 text-left bg-white
//                     border-0 rounded-none transition focus:outline-none" 
//                     type="button" data-bs-toggle="collapse" data-bs-target={"#collapse1"} aria-expanded="false" aria-controls={"#collapse1"}>
//                     <p><b>Line {warning.line}: </b>{warning.message}</p>
//                 </button>
//             </h2>
//             <div id="collapse1" className="accordion-collapse collapse"
//             data-bs-parent="#warningsAccordion">
//                 {buildMessage(warning["message-id"])}
//             </div>
//         </div>

//     return (
//         <div className="accordion" id="warningsAccordion">
//             {msg}
//         </div>
//     );
// }

export default Feedback;