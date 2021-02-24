import React from 'react';
const markColor = 'red';
const labelTop = 20;
const shortLineHeight = 10;
const longLineHeight = 15;
const pointerHeight = 30;
const pointerTop = 35;
const pointerColor = 'blue'

export const ShortLine = function ({ left }) {
    return <div style={{
        left,
        width: 1,
        height: shortLineHeight,
        backgroundColor: markColor,
        position: 'absolute'
    }}></div>
}
export const LongLine = function ({ left, labeltext }) {
    return <>
        <div style={{
            left,
            width: 1,
            height: longLineHeight,
            backgroundColor: markColor,
            position: 'absolute'
        }}></div>
        <label style={{
            left,
            position: 'absolute',
            fontSize: 12,
            top: labelTop,
            transform: [`translateX(${-50}%)`]
        }}>{labeltext}</label>
    </>
}

export const TimePointer = function ({ left, labeltext }) {

    return <>
        <div style={{
            left,
            width: 1,
            height: pointerHeight,
            backgroundColor: pointerColor,
            position: 'absolute'
        }}></div>
        <label style={{
            left,
            position: 'absolute',
            fontSize: 12,
            top: pointerTop,
            transform: [`translateX(${-50}%)`],
            whiteSpace:'nowrap'
        }}>{labeltext}</label>
    </>
}