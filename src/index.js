import { ShortLine, LongLine, TimePointer } from './toolComponets'
import React from 'react'
import './style.less'

const minutes_per_step = [1, 5, 10, 15, 20, 30, 60, 120, 180, 240, 360, 720, 1440]; // min/格 length=14
/**
 * 
 * @param {number} time 时间戳 ms 
 */
function calTimeTitle(time) {
    var datetime = new Date(time)
    if (datetime.getHours() == 0 && datetime.getMinutes() == 0 && datetime.getMilliseconds() == 0) {
        return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
            ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
            datetime.getFullYear();
    }
    return datetime.getHours() + ':' + ('0' + datetime.getMinutes().toString()).substr(-2);
}
function calTimePointer(time) {
    var datetime = new Date(time)
    // return ('0' + datetime.getDate().toString()).substr(-2) + '.' +
    //         ('0' + (datetime.getMonth() + 1).toString()).substr(-2) + '.' +
    //         datetime.getFullYear();
    return `${datetime.getFullYear()}-${('0' + (datetime.getMonth() + 1).toString()).substr(-2)}-${('0' + (datetime.getDate()).toString()).substr(-2)} ${('0' + datetime.getHours()).substr(-2)}:${('0' + datetime.getMinutes()).substr(-2)}:${('0' + datetime.getSeconds()).substr(-2)}`
}

function calOffsetX(e) {
    if (e.nativeEvent.target.id !== 'ruler') {
        var offsetX = e.nativeEvent.pageX - e.nativeEvent.target.parentElement.offsetLeft;
    } else {
        var { offsetX } = e.nativeEvent;
    }
    return offsetX
}

class TimeSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            leftTime: props.leftTime || new Date().valueOf(), // 最左侧的时间值 linux时间 ms
            // changeLength : props.changeLength, // 改变一次要增多少
            timeLength: props.timeLength, // 整条尺子的时间长度 h
            // changetimes : props.changetimes // 上下最大允许的调整范围
            showPointer: false,
            pointerPosition: 0,
            pointerValue: 0,

        }
        this.rulerRef = React.createRef();
        this.singleGridLength = 20; // 默认每个小格20px
        this.singleLongGridLength = 80;// 默认每个大格80px
    }
    componentDidMount() {
        this.calTimeInfo()
        this.forceUpdate()
    }
    calTimeInfo = () => {
        if (!this.rulerRef.current) {
            return null
        }
        // 尺子总长 px
        var rulerLength = this.rulerRef.current.offsetWidth;
        // 整条尺子的时间长度 h // 最左侧的时间点 ms
        var { timeLength, leftTime } = this.state;
        // 单位时间的长度 px/ms
        var pxPerMs = rulerLength / (timeLength * 3600 * 1000);
        // 单位时间的长度 px/min
        var pxPerMin = rulerLength / (timeLength * 60);
        // 一个小格的像素长度
        var pxPerStep = this.singleGridLength;
        // 1个小格的时间长度 min
        var minPerStep = pxPerStep / pxPerMin;
        // 1个小格的时间长度标准化
        for (var i = 0; i < minutes_per_step.length; i++) {
            if (minPerStep <= minutes_per_step[i]) {
                minPerStep = minutes_per_step[i]; // 单个格的时间
                pxPerStep = minPerStep * pxPerMin
                break;
            }
        }
        // 1个大格的时间长度 min
        var minPerBigStep = this.singleLongGridLength / pxPerMin;
        var pxPerBigStep;
        // 小格的数量 
        var cellNum = rulerLength / pxPerStep;
        // 1个大格的时间长度标准化
        for (var i = 0; i < minutes_per_step.length; i++) {
            if (minPerBigStep <= minutes_per_step[i]) {
                minPerBigStep = minutes_per_step[i];
                break;
            }
        }
        // 第一个格距离开始点的 ms
        var timeOffset = (leftTime % (minPerStep * 60 * 1000)) === 0 ? 0 : (minPerStep * 60 * 1000) - (leftTime % (minPerStep * 60 * 1000));
        // 第一个格距离开始点的 px
        var pxOffset = timeOffset * pxPerMs;
        return {
            cellNum,
            pxOffset,
            timeOffset,
            minPerBigStep,
            minPerStep,
            pxPerStep,
            pxPerMs
        }
    }
    // 返回尺子刻度的jsx
    calRuler(timeInfo) {
        var { cellNum, pxOffset, timeOffset, minPerBigStep, minPerStep, pxPerStep, pxPerMs } = timeInfo;
        var { timeLength, leftTime } = this.state;
        var jsxArr = [];
        for (var i = 0; i < cellNum; i++) {
            var left = pxOffset + i * pxPerStep;

            var time = leftTime + timeOffset + i * (minPerStep * 60 * 1000);

            if (time / (60 * 1000) % minPerBigStep == 0) {
                // 用长线并加标注
                var labeltext = calTimeTitle(time)
                jsxArr.push(<LongLine left={left} labeltext={labeltext} key={i} />)
            } else {
                // 不加标注
                jsxArr.push(<ShortLine left={left} key={i} />)
            }
        }
        return (<>
            {jsxArr}
        </>)
    }
    handleMouseEnterHandler = (e) => {
        this.setState({ showPointer: true });
    }
    handleMouseLeaveHandler = () => {
        this.setState({ showPointer: false });
    }
    handleMouseMoveHandler = (e, timeInfo) => {
        // 对e的target做处理
        var offsetX = calOffsetX(e)
        if(offsetX<0){
            this.setState({
                showPointer:false
            })
            return
        }
        var { pxPerMs } = timeInfo;
        var time = this.state.leftTime + offsetX / pxPerMs;
        var timeStr = calTimePointer(time);
        this.setState({
            pointerPosition: offsetX,
            pointerValue: timeStr,
            showPointer:true
        })
    }
    handleWheelHandler = (e) => {
        console.log(e.deltaY)

    }
    render() {
        var timeInfo = this.calTimeInfo()
        const { showPointer, pointerPosition, pointerValue } = this.state
        // 计算
        return (
            <div className={'timeSlider'}>
                <div className='left'>
                    <div className='lt'></div>
                    <div className='lb'></div>
                </div>
                <div className='right'>
                    {/* 尺子 */}
                    <div className='rt' ref={this.rulerRef} id={'ruler'}
                        onMouseEnter={(e) => { this.handleMouseEnterHandler(e) }}
                        onMouseLeave={() => { this.handleMouseLeaveHandler() }}
                        onMouseMove={(e) => {
                            if(this.state.showPointer){
                                this.handleMouseMoveHandler(e, timeInfo)
                            }else{
                                // console.log(e.movementX) 
                                var leftTime = this.state.leftTime;
                                this.setState({
                                    leftTime:leftTime - e.movementX / timeInfo.pxPerMs
                                }) 
                            }                         
                        }}
                        onMouseDown = {()=>{
                            this.setState({showPointer:false})
                        }}
                        onMouseUp = {(e)=>{
                            var offsetX = calOffsetX(e)
                            
                            var { pxPerMs } = timeInfo;
                            var time = this.state.leftTime + offsetX / pxPerMs;
                            var timeStr = calTimePointer(time);
                            this.setState({
                                showPointer:true,
                                pointerPosition: offsetX,
                                pointerValue: timeStr,
                            })
                        }}
                        onWheel={(e) => { this.handleWheelHandler(e) }}
                    >
                        {timeInfo && this.calRuler(timeInfo)}
                        {showPointer ? <TimePointer left={pointerPosition} labeltext={pointerValue} /> : null}
                    </div>
                    <div className='rb'></div>
                </div>
            </div>
        )
    }
}

export default TimeSlider