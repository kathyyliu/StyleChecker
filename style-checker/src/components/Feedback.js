import React, {useEffect, useState} from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './Feedback.css'


const handleClick = (i) => {
    const msg = document.getElementById("popover-line-" + i);
    if (msg.style.display === 'none') {
        msg.style.display = 'block';
    }
    else {
        msg.style.display = 'none';
    }
};

function Feedback(props) {
    const [feedbackList, setFeedbackList] = useState([]);
    const [buttonList, setButtonList] = useState([]);

  function buildMessage(id) {
    const ex = props.examples[id];
    return (
      <div className="py-2 px-3 whitespace-pre-wrap text-left">
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

  useEffect(() => {
    const elms = [];
    props.warnings.forEach((warning, i) => {
      const popoverId = "popover-line-" + i;
      const offset = 'top-[' + ((warning.line - 1) * 21 + 10) + 'px]';
      const classes = 'popover language-python absolute right-0 z-10 ' + offset;
      elms.push(
        <div id={popoverId} className={classes} key={i}>
          <div className="py-2 px-3 bg-gray-100 rounded-t-lg border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              <b>Line {warning.line}: </b>{warning.message}
            </h3>
          </div>
          <div className="py-2 px-3">
            {buildMessage(warning["message-id"])}
          </div>
        </div>);
      setFeedbackList(elms);
    });
  }, [props.warnings]);

  

  useEffect(() => {
    const buts = [];
    props.warnings.forEach((warning, i) => {
      const lineButId = "line-but-" + i;
      const offset = 'top-[' + ((warning.line - 1) * 21 + 10) + 'px]';
      const classes = 'popover opacity-0 border-solid min-h-[21px] max-w-[40px] absolute left-[300px] z-10 ' + offset;
      buts.push(
        <button id={lineButId} className={classes} key={i} onClick={() => handleClick(i)}>
        </button>);
      setButtonList(buts);
    });
  }, [props.warnings]);

  Prism.highlightAll();

  return (
    <div className="relative ml-4 min-w-[300px]">
      <div className='absolute invisible top-[10px] right-0'>wa</div>
            {feedbackList}
            {buttonList}
    </div>
  );
} 

export default Feedback;