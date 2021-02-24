
import {VideoPlayer} from 'bonc-h5player-components';
import React from 'react';
import ReactDOM from 'react-dom';
import TimeSlider from '../src/index';

// 毫秒
const leftTime = new Date().valueOf()
// 小时
const timeLength = 24*2 

const App = function(){
    const videoRef = React.createRef()
    const timelineRef = React.createRef()
    return (
        <div style={{
            display:'flex',
            flexDirection:'column'
        }}>
            <div style= {{position:'relative',height:600,width:800}}>
                <VideoPlayer 
                    ref = {videoRef}
                    style ={{
                        width : 800,
                        height : 600
                    }}   
                />
            </div>
            {/* 时间轴 */}
            <TimeSlider 
                ref = {timelineRef}
                leftTime = {leftTime}             
                timeLength = {timeLength}
            />
            <div className='info'>
                <input placeholder='开始时间' value='aa' />
                <input placeholder='结束时间' value='aa' />
                <button>查询</button>
            </div>
            
        </div>
    )
}

ReactDOM.render(<App />, document.getElementById("root"))