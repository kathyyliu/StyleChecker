import React, {useEffect, useState} from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './Feedback.css'


function Feedback(props) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [buttonList, setButtonList] = useState([]);
  const [openedMsg, setOpenedMsg] = useState(0);

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

  const handleClick = (i) => {
    const msg = document.getElementById("popover-" + i);
    if (msg.style.display !== 'block') {
      msg.style.display = 'block';
      if (openedMsg === -1) {
        const buttons = document.getElementsByClassName('lineBut');
        Array.from(buttons).forEach((but) => {
          but.style.left = '300px';
        });
      }
      else {
        const close = document.getElementById('popover-' + openedMsg);
        if (close) {
          close.style.display = 'none';
        }
      }
      setOpenedMsg(i);
    }
    else {
      msg.style.display = 'none';
      setOpenedMsg(-1);
      const buttons = document.getElementsByClassName('lineBut');
      Array.from(buttons).forEach((but) => {
        but.style.left = '0px';
      }); 
    }
  };

  useEffect(() => {
    if (props.isSubmitted) {
        const elms = [];
        props.warnings.forEach((warning, i) => {
        const popoverId = "popover-" + i;
        const display = i === openedMsg ? 'block' : 'none';
        const styles = {
          top: ((warning.line - 1) * 21) + 'px',
          display: display,
        };
        const classes = 'popover language-python absolute right-0 z-10';
        elms.push(
            <div id={popoverId} className={classes} style={styles} key={i}>
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
    }
  }, [props.warnings, openedMsg]);

  useEffect(() => {
    if (props.isSubmitted) {
      const buts = [];
      props.warnings.forEach((warning, i) => {
      const lineButId = "line-but-" + i;
      const offset = {top: ((warning.line - 1) * 21 + 11) + 'px'};
      const classes = 'lineBut opacity-0 border-solid min-h-[21px] w-[40px] absolute z-10';
      buts.push(
        <button id={lineButId} className={classes} type='button' key={i} style={offset} onClick={() => handleClick(i)}>
        </button>);
    });
     setButtonList(buts);
    }
  }, [props.warnings, openedMsg]);

  Prism.highlightAll();
  return (
    <div className={openedMsg === -1 ? "relative" : "relative ml-4 min-w-[300px]"}>
        <div id='feedback'>
            {feedbackList}
            {/* {currMessage ? currMessage : feedbackList} */}
        </div>
        <div id='buttons'>
            {buttonList}
        </div>
            
    </div>
  );
} 

export default Feedback;