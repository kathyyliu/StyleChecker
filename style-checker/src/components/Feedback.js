import React, {useEffect, useState} from 'react';
import Prism from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import 'prismjs/themes/prism-coy.css';
import './Feedback.css';
import  DropArrow from './DropArrow.svg';


function Feedback(props) {
  const [groupedWarns, setGroupedWarns] = useState([]);
  const [feedbackList, setFeedbackList] = useState([]);
  const [buttonList, setButtonList] = useState([]);
  const [openedMsg, setOpenedMsg] = useState(0);

  useEffect(() => {
    const newWarns = [];
    let group = [props.warnings[0]];
    for (let i = 1; i < props.warnings.length; i++) {
      if (props.warnings[i].line !== props.warnings[i - 1].line) {
        newWarns.push(group);
        group = [];
      }
      group.push(props.warnings[i]);
    }
    newWarns.push(group);
    setGroupedWarns(newWarns);
  }, [props.warnings]);

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
    if (!props.isSubmitted) {
      return;
    }
    const elms = [];
    groupedWarns.forEach((group, i) => {
      const popoverId = "popover-" + i;
      const display = i === openedMsg ? 'block' : 'none';
      const styles = {
        top: ((group[0].line - 1) * 21) + 'px',
        display: display,
      };
      const classes = 'popover language-python absolute right-0 z-10';
      let elm;
      if (group.length === 1) {
        elm =
          <div id={popoverId} className={classes} style={styles} key={i}>
            <div className="py-2 px-3 bg-gray-100 rounded-t-lg border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
              <b>Line {group[0].line}: </b>{group[0].message}
              </h3>
            </div>
            <div className="py-2 px-3">
              {buildMessage(group[0]["message-id"])}
            </div>
          </div>;
      }
      else {
        elm = 
          <div id={popoverId} style={styles} key={i} className="popover language-python absolute right-0 z-10" >
            {group.map((warning, j) => 
              <div>
                <div className="py-2 px-3 bg-gray-100 rounded-t-lg border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">
                    <button className='text-left transition' type="button" data-bs-toggle="collapse" data-bs-target={'#collapse-' + i + '-' + j}>
                      <div className='inline-block w-[232px]'>
                        <b>Line {warning.line}: </b>{warning.message}
                      </div>
                      <img src={DropArrow} className='pr-1'style={{width: 20, display: 'inline-block'}}></img>
                    </button>
                  </h3>
                </div>
                <div id={'collapse-' + i + '-' + j} className="collapse py-2 px-3" data-bs-parent={'#' + popoverId}>
                  {buildMessage(warning["message-id"])}
                </div>
              </div>
            )}
          </div>;
      }
      elms.push(elm);
    });
    setFeedbackList(elms);
  }, [groupedWarns, openedMsg]);

  useEffect(() => {
    if (props.isSubmitted) {
      const buts = [];
      groupedWarns.forEach((group, i) => {
        const warning = group[0];
        const lineButId = "line-but-" + i;
        const offset = {top: ((warning.line - 1) * 21 + 11) + 'px'};
        const classes = 'lineBut opacity-0 border-solid min-h-[21px] w-[40px] absolute z-10';
        buts.push(
          <button id={lineButId} className={classes} type='button' key={i} style={offset} onClick={() => handleClick(i)}>
          </button>);
      });
     setButtonList(buts);
    }
  }, [groupedWarns, openedMsg]);

  Prism.highlightAll();
  return (
    <div className={openedMsg === -1 ? "relative" : "relative ml-4 min-w-[300px]"}>
        <div id='feedback'>
            {feedbackList}
        </div>
        <div id='buttons'>
            {buttonList}
        </div>
            
    </div>
  );
} 

export default Feedback;