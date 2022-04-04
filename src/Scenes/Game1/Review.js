import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum } from "../../components/CommonFunctions"

let timerList = []
//-0.5,1.25,5,-5


export default function Review1({ _baseGeo, nextFunc }) {
    const audioList = useContext(UserContext)
    const starList = Array.from({ length: 25 }, ref => useRef())
    const baseRef = useRef()

    useEffect(
        () => {

            audioList.bodyAudio.src = "./sounds/nowsay.mp3"
            setTimeout(() => {
                audioList.bodyAudio.play();
                setTimeout(() => {
                    starList.map((star, index) => {
                        setTimeout(() => {
                            star.current.style.transition = '0.5s'
                            star.current.style.transform = 'scale(1.2)'
                            if (index == 24)
                                setTimeout(() => {
                                    nextFunc()
                                }, 2500);
                        }, 1000 * index);
                    });
                }, audioList.bodyAudio.duration * 1000 + 500)
            }, 2000);
            return () => {
            }
        }, []
    )

    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>


                {
                    Array.from(Array(25).keys()).map(value =>
                        <div
                            ref={starList[value]}
                            style={{
                                position: 'absolute',
                                width: '7%',
                                height: '7%',
                                left: (0.2 + (value % 5) * 0.125) * 100 + '%',
                                top: (0.14 + 0.12 * parseInt((value / 5))) * 100 + '%',
                            }}>

                            < BaseImage
                                scale={1}
                                posInfo={{ t: 0.8, l: 0.0 }}
                                url={'animations/block.svg'}
                            />
                            < BaseImage
                                scale={0.5}
                                posInfo={{ l: 0.26, t: 1.05 }}
                                url={'SB_53_Text-Interactive/SB_53_TI_Game1_1' + generateStandardNum((value + 1) * 2) + '.svg'}
                            />
                        </div>
                    )
                }



            </div>
        </div>
    );

}
