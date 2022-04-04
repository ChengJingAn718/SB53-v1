import React, { useEffect, useContext, useRef, useState } from 'react';
import "../../stylesheets/styles.css";
import BaseImage from '../../components/BaseImage';

import { UserContext } from '../../components/BaseShot';
import { prePathUrl, generateStandardNum, setRepeatAudio, startRepeatAudio, stopRepeatAudio } from "../../components/CommonFunctions"

import Lottie from "react-lottie-segments";
import loadAnimation from '../../utils/loadAnimation'

var isGameStarted = false;

let animationList = []
new loadAnimation('main/Chick_1.json').then(result => {
    animationList[1] = result;
}, () => { });

new loadAnimation('main/Chicken1_1.json').then(result => {
    animationList[2] = result;
}, () => { });

new loadAnimation('main/Chicken2_1.json').then(result => {
    animationList[0] = result;
}, () => { });

let timerList = []
//3.5,-3.5,
// 5,-5

let isGamestoneted = false;
let currentNum = 0;
let stepNumRange = 2;
let currentStep = 0
let movingSceneNum = 0;
const layoutstonetPos = { x: -1.2, y: 0.28 }
const translatestonetPos = { x: 2.2, y: 0.3 }

const GamePanel = ({ finishGame, _baseGeo, _geo, stopSound }, ref) => {
    const audioList = useContext(UserContext)
    const movingSceneList = [
        0,
        0.45,
        0.8,
        1.2,
        1.65,
        2.1,
        2.5,
        2.9,
        3.4,
        3.8,
        4.1
    ]

    const [isStopAni, setStopAni] = useState(false)
    const baseRef = useRef()
    const backRef = useRef()

    const greenstone = useRef();
    const redstone = useRef();
    const lastHen = useRef();

    const henAnimation = useRef();

    const targetRange = 0.062
    const stepRange = -0.05
    const foodAreaLength = 0.24

    const sparkBaseRef = useRef()
    const sparkRefList = [useRef(), useRef(), useRef()]

    const characterList = Array.from({ length: 4 }, ref => useRef())
    const feedList = Array.from({ length: 8 }, ref => useRef())
    const stoneList = Array.from({ length: 100 }, ref => useRef())
    const stoneBaseList = Array.from({ length: 50 }, ref => useRef())
    const numberList = Array.from({ length: 100 }, ref => useRef())
    const starRefList = Array.from({ length: 5 }, ref => useRef())



    const henAniPosList = [
        { x: 0.72, y: 0.045 },
        { x: 1.58, y: 0.045 },
        { x: 2.44, y: 0.11 },
        { x: 3.29, y: 0.12 }
    ]


    const heightList = [
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
        0, -1, -2, -3, -2, -1, -2, -3, -2, -1,
    ]

    useEffect(
        () => {
            setRepeatAudio(audioList.repeatAudio)

            setTimeout(() => {
                setStopAni(true)
            }, 100);
            greenstone.current.style.opacity = 0
            redstone.current.style.opacity = 0

            lastHen.current.className = 'hideObject'
            henAnimation.current.className = 'hideObject'

            feedList.map((feed, index) => {
                if (index % 2 != 0)
                    feed.current.setClass('hideObject')
            })

            characterList.map((character, index) => {
                if (index > 0)
                    character.current.setClass('hideObject')
            })

            backRef.current.style.transition = '0s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                movingSceneList[movingSceneNum])) + 'px, '
                + _baseGeo.height * (translatestonetPos.y) + 'px)'

            return () => {

                isGamestoneted = false;
                currentNum = 0;
                currentStep = 0

                movingSceneNum = 0;

                audioList.clapAudio.pause();
                audioList.clapAudio.currentTime = 0;
            }
        }, []
    )

    function returnOption(index) {
        return {
            loop: true,
            autoplay: true,
            animationData: animationList[index],
            rendererSettings: {
                preserveAspectRatio: "xMidYMid slice"
            }
        };
    }

    if (isGamestoneted)
        reRenderingFunc()


    React.useImperativeHandle(ref, () => ({
        showingScene: () => {
            backRef.current.style.transition = '2s'
            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                movingSceneList[movingSceneNum] - 1)) + 'px, '
                + _baseGeo.height * (translatestonetPos.y) + 'px) scale(1)'

            setTimeout(() => {
                isGamestoneted = true;
            }, 500);

            setTimeout(() => {
                audioList.henNormalAudio.play();
            }, 2500);
        },
        scaleScene: () => {
            backRef.current.style.transition = '4s'
            backRef.current.style.transform = 'scale(1.2) ' + 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                movingSceneList[movingSceneNum])) + 'px, '
                + _baseGeo.height * (translatestonetPos.y) + 'px)'

        }
    }))


    function reRenderingFunc() {
        if (movingSceneNum > 0 && movingSceneNum % 2 != 0) {
            henAnimation.current.style.left = (layoutstonetPos.x + 0.06 + henAniPosList[(movingSceneNum - 1) / 2].x) * 100 + '%'
            henAnimation.current.style.bottom = (layoutstonetPos.y + 0.22 + henAniPosList[(movingSceneNum - 1) / 2].y) * 100 + '%'
        }

        backRef.current.style.transition = '0s'

        backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
            movingSceneList[movingSceneNum] - 1)) + 'px, '
            + _baseGeo.height * (translatestonetPos.y) + 'px)'

        if (currentNum % 10 == 0) {
            characterList[0].current.setPosInfo({
                l: layoutstonetPos.x + 0.03 + targetRange * currentNum + currentStep * foodAreaLength,
                b: layoutstonetPos.y + 0.15
            })
        }
        else {
            characterList[0].current.setPosInfo({
                l: layoutstonetPos.x + 0.03 + targetRange * currentNum + currentStep * foodAreaLength,
                b: layoutstonetPos.y + 0.15 + stepRange * heightList[currentNum - 1]
            })
        }


    }

    function playEatingAni() {

        henAnimation.current.className = 'showObject'
        setStopAni(false)


        characterList[0].current.setClass('hideObject')
        henAnimation.current.style.left = (layoutstonetPos.x + 0.06 + henAniPosList[(movingSceneNum - 1) / 2].x) * 100 + '%'
        henAnimation.current.style.bottom = (layoutstonetPos.y + 0.22 + henAniPosList[(movingSceneNum - 1) / 2].y) * 100 + '%'

        audioList.henFeedAudio.play();

        setTimeout(() => {
            setStopAni(true)

            movingSceneNum++;

            feedList[movingSceneNum - 1].current.setClass('showObject')
            feedList[movingSceneNum - 2].current.setClass('hideObject')

            setTimeout(() => {

                setTimeout(() => {
                    baseRef.current.style.pointerEvents = ''
                    setTimeout(() => {
                        audioList.henNormalAudio.play();
                    }, 500);
                }, 2000);

                henAnimation.current.className = 'hideObject'

                characterList[0].current.setClass('showObject')
                characterList[0].current.setPosInfo({
                    l: layoutstonetPos.x + 0.03 + targetRange * currentNum + currentStep * foodAreaLength,
                    b: layoutstonetPos.y + 0.15
                })

                audioList.henFeedAudio.pause();
                audioList.henFeedAudio.currentTime = 0;

                backRef.current.style.transition = '2s'
                backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                    movingSceneList[movingSceneNum] - 1)) + 'px, '
                    + _baseGeo.height * (translatestonetPos.y) + 'px)'
            }, 500);
        }, 4000);

    }

    function clickFunc(num) {

        stopRepeatAudio();
        if (currentNum == 0) {

            stopSound();
        }

        clearTimeout(timerList[10])


        if (num >= currentNum) {
            let currentstone = stoneBaseList[num]
            currentstone.current.style.transition = '0.1s'
            currentstone.current.style.transform = 'scale(0.95)'
            setTimeout(() => {
                currentstone.current.style.transform = 'scale(1)'
            }, 100);

            redstone.current.style.opacity = 0
            greenstone.current.style.opacity = 0

            if (num + 1 == currentNum + stepNumRange) {

                audioList.buzzAudio.pause();
                audioList.tingAudio.currentTime = 0;
                audioList.tingAudio.play();


                baseRef.current.style.pointerEvents = 'none'

                stoneBaseList[currentNum].current.style.cursor = 'default'
                stoneBaseList[currentNum + 1].current.style.cursor = 'default'

                currentNum += stepNumRange;
                showButtonAni(greenstone, num)

                setTimeout(() => {
                    for (let i = 1; i < 4; i++) {
                        characterList[i].current.setPosInfo({
                            l: layoutstonetPos.x + 0.03 + [0, 0.03, 0.06, 0.1][i] +
                                targetRange * (currentNum - stepNumRange) + foodAreaLength * currentStep,
                            b: layoutstonetPos.y +
                                0.15 + stepRange * heightList[currentNum - stepNumRange]
                                + [0, 0.04, 0.08, 0.04][i]
                        })
                    }

                    let num = 0;
                    let interval = setInterval(() => {
                        characterList[num].current.setClass('hideObject')

                        characterList[0].current.setPosInfo({
                            l: layoutstonetPos.x + 0.03 + targetRange * currentNum + foodAreaLength * currentStep,
                            b: layoutstonetPos.y + 0.15 + stepRange * heightList[currentNum - 1]
                        })

                        if (num == 3) {
                            clearInterval(interval)
                            characterList[0].current.setClass('showObject')

                        }
                        else {
                            num++
                            characterList[num].current.setClass('showObject')
                        }
                    }, 150);

                    sparkBaseRef.current.style.left = (layoutstonetPos.x + 0.13 + targetRange * currentNum + foodAreaLength * currentStep) * 100 + "%"
                    sparkBaseRef.current.style.bottom = (layoutstonetPos.y + 0.23 + stepRange * heightList[currentNum - 1]) * 100 + "%"

                    setTimeout(() => {
                        let num = 0;
                        sparkRefList[0].current.setClass('showObject')
                        let interval = setInterval(() => {
                            sparkRefList[num].current.setClass('hideObject')
                            if (num < 2) {
                                num++
                                sparkRefList[num].current.setClass('showObject')
                            }
                            else {
                                clearInterval(interval)
                            }
                        }, 100);
                    }, 500);



                    setTimeout(() => {

                        stoneList[currentNum - 2].current.setUrl('SB_53_Prop-Interactive/SB_53_PI_game1_stone_Inactive_01.svg')
                        numberList[currentNum - 2].current.setStyle({ opacity: 0.4 })

                        stoneBaseList[currentNum - 1].current.style.cursor = 'default'
                        stoneBaseList[currentNum - 2].current.style.cursor = 'default'



                        if (currentNum % 10 == 0) {

                            audioList.henNormalAudio.pause();
                            starRefList[currentStep].current.setClass('hide')

                            currentStep++;
                            movingSceneNum++;
                            baseRef.current.style.pointerEvents = 'none'

                            backRef.current.style.transition = '2s'
                            backRef.current.style.transform = 'translate(' + (_baseGeo.width * (translatestonetPos.x -
                                movingSceneList[movingSceneNum] - 1)) + 'px, '
                                + _baseGeo.height * (translatestonetPos.y) + 'px)'


                            setTimeout(() => {
                                if (currentStep < 5) {
                                    playEatingAni();
                                    startRepeatAudio();
                                }
                                else {
                                    isGamestoneted = false;
                                    lastHen.current.className = 'showObject'
                                    audioList.henCrowdAudio.play();
                                    henAnimation.current.className = 'hideObject'
                                    characterList[0].current.setClass('hideObject')

                                    audioList.henNormalAudio.pause();
                                    audioList.clapAudio.play();

                                    setTimeout(() => {
                                        baseRef.current.style.transition = '0.7s'
                                        baseRef.current.style.opacity = 0

                                        audioList.henCrowdAudio.pause();
                                        audioList.henCrowdAudio.currentTime = 0;
                                        audioList.henNormalAudio.currentTime = 0;

                                        setTimeout(() => {
                                            finishGame();
                                        }, 700);
                                    }, 5000);
                                }

                                greenstone.current.style.opacity = 0


                            }, 2000);

                        }

                        else {
                            for (let i = currentNum - 2; i < currentNum; i++) {
                                stoneBaseList[i].current.style.cursor = 'default'
                            }
                            baseRef.current.style.pointerEvents = ''
                            startRepeatAudio();
                        }


                    }, 1000);
                }, 200);
            }
            else {
                audioList.tingAudio.pause();

                audioList.buzzAudio.currentTime = 0;
                audioList.buzzAudio.play();
                startRepeatAudio();

                showButtonAni(redstone, num)
            }
        }
    }

    function showButtonAni(obj, num) {


        obj.current.style.transition = '0.0s'
        obj.current.style.opacity = '0'

        if (obj == redstone) {
            obj.current.style.left = (layoutstonetPos.x + 0.155 + num * targetRange + foodAreaLength * currentStep) * 100 + '%'
            obj.current.style.bottom = (layoutstonetPos.y + 0.215 + heightList[num] * stepRange) * 100 + '%'
        }
        else {
            obj.current.style.left = (layoutstonetPos.x + 0.155 + num * targetRange + foodAreaLength * currentStep) * 100 + '%'
            obj.current.style.bottom = (layoutstonetPos.y + 0.215 + heightList[num] * stepRange) * 100 + '%'
        }

        setTimeout(() => {
            obj.current.style.transition = '0.5s'
            obj.current.style.opacity = 1
        }, 100);
    }


    return (
        <div ref={baseRef}
            className="aniObject"  >
            <div
                ref={backRef}
                style={{
                    position: "fixed", width: _baseGeo.width + "px",
                    height: _baseGeo.height + "px"
                    , left: _baseGeo.left + _baseGeo.width * 0.0 + "px",
                    bottom: _baseGeo.bottom + _baseGeo.height * 0.0 + "px",
                }}>
                <img
                    style={{
                        width: '100%',
                        left: '0%', bottom: '0%',
                        transform: 'scale(6.5)'
                    }}
                    src={prePathUrl() + "images/SB_53_BG/SB53_Forest_BG-01.svg"}
                />

                {
                    Array.from(Array(50).keys()).map(value =>

                        <div
                            ref={stoneBaseList[value]}
                            onClick={() => { clickFunc(value) }}
                            style={{
                                position: 'absolute',
                                width: '8%',
                                height: '8%',
                                cursor: 'pointer',
                                overflow: 'hidden',
                                bottom: (layoutstonetPos.y + 0.2 + heightList[value] * stepRange) * 100 + '%',
                                left: (layoutstonetPos.x + 0.18 +
                                    foodAreaLength * parseInt(value / 10) +
                                    value * targetRange) * 100 + '%'
                            }}>

                            < BaseImage
                                scale={1.5}
                                posInfo={{ t: -0.8, l: -0.3 }}

                                ref={stoneList[value]}
                                url={'SB_53_Prop-Interactive/SB_53_PI_game1_stone_01.svg'}
                            />
                            < BaseImage
                                ref={numberList[value]}
                                scale={0.5}
                                posInfo={{ l: 0.15, t: -0.1 }}
                                url={'SB_53_Text-Interactive/SB_53_TI_Game1_1' + generateStandardNum(value + 1) + '.svg'}
                            />
                        </div>
                    )
                }
                <div
                    ref={sparkBaseRef}
                    style={{
                        position: 'absolute',
                        pointerEvents: 'none',
                        width: '5%',
                        height: '5%',
                        left: (layoutstonetPos.x + 0.132) * 100 + '%',
                        bottom: (layoutstonetPos.y + 0.489) * 100 + '%'
                    }}
                >
                    {
                        Array.from(Array(3).keys()).map(value =>
                            <BaseImage
                                ref={sparkRefList[value]}
                                className='hideObject'
                                style={{ transform: 'scale(' + [1.5, 2, 3][value] + ')' }}
                                url={'magic/sb_52_magic_wand_sparkels_' + (1 + value) + '.svg'}
                            />
                        )
                    }
                </div>

                {/* foods 1*/}

                <BaseImage
                    scale={0.2}
                    ref={feedList[0]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.19,
                        l: layoutstonetPos.x + 0.86
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_food_02.svg'}
                />

                <BaseImage
                    scale={0.2}
                    ref={feedList[1]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.189,
                        l: layoutstonetPos.x + 0.865
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_finished_food_01.svg'}
                />

                {/* foods 2*/}


                <BaseImage
                    scale={0.2}
                    ref={feedList[2]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.189,
                        l: layoutstonetPos.x + 0.895 + 0.81
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_food_04.svg'}
                />


                <BaseImage
                    scale={0.2}
                    ref={feedList[3]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.187,
                        l: layoutstonetPos.x + 0.892 + 0.81
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_finished_food_04.svg'}
                />


                {/* foods 3*/}

                <BaseImage
                    scale={0.16}
                    ref={feedList[4]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.28,
                        l: layoutstonetPos.x + 0.892 + 1.7
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_food_03-04.svg'}
                />

                <BaseImage
                    scale={0.16}
                    ref={feedList[5]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.284,
                        l: layoutstonetPos.x + 0.901 + 1.7
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_finished_food_03.svg'}
                />


                {/* foods 4*/}

                <BaseImage
                    scale={0.18}
                    ref={feedList[6]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.264,
                        l: layoutstonetPos.x + 0.892 + 2.535
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_food_03-03.svg'}
                />

                <BaseImage
                    scale={0.18}
                    ref={feedList[7]}
                    posInfo={{
                        b: layoutstonetPos.y + 0.274,
                        l: layoutstonetPos.x + 0.901 + 2.52
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_finished_food_02.svg'}
                />


                <div
                    ref={lastHen}
                    style={{
                        position: "absolute", width: '20%',
                        left: (layoutstonetPos.x + 0.901 + 3.41) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.27) * 100 + '%',
                    }}>
                    <Lottie autoplay loop options={returnOption(0)}
                        mouseDown={false}
                        isClickToPauseDisabled={true}
                        speed={0.56}
                    />
                </div>
                <div
                    style={{
                        position: "absolute", width: '9%',
                        left: (layoutstonetPos.x + 0.901 + 3.38) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.27) * 100 + '%',
                    }}>
                    <Lottie autoplay loop options={returnOption(1)}
                        mouseDown={false}
                        isClickToPauseDisabled={true}
                        speed={0.56}
                    />
                </div>

                <div
                    style={{
                        position: "absolute", width: '10%',
                        left: (layoutstonetPos.x + 0.901 + 3.42) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.23) * 100 + '%',
                    }}>
                    <Lottie autoplay loop options={returnOption(1)}
                        mouseDown={false}
                        isClickToPauseDisabled={true}
                        speed={0.8}
                    />
                </div>


                <div
                    style={{
                        position: "absolute", width: '9%',
                        left: (layoutstonetPos.x + 0.901 + 3.58) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.27) * 100 + '%',
                    }}>
                    <Lottie autoplay loop options={returnOption(1)}
                        mouseDown={false}
                        isClickToPauseDisabled={true}
                        speed={0.66}
                    />
                </div>

                <div
                    style={{
                        position: "absolute", width: '10%',
                        left: (layoutstonetPos.x + 0.901 + 3.52) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.23) * 100 + '%',
                    }}>
                    <Lottie autoplay loop options={returnOption(1)}
                        mouseDown={false}
                        isClickToPauseDisabled={true}
                        speed={0.76}
                    />
                </div>



                <BaseImage
                    scale={0.2}
                    posInfo={{
                        b: layoutstonetPos.y + 0.15,
                        l: layoutstonetPos.x + 0.901 + 3.38
                    }}
                    url={'SB_53_Prop-Interactive/SB_53_PI_game1_food_01.svg'}
                />


                <div
                    ref={greenstone}
                    style={{
                        position: 'absolute',
                        width: '12.5%',
                        height: '12.5%',
                        pointerEvents: 'none',
                        bottom: (layoutstonetPos.y + 0.223 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutstonetPos.x + 0.159) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB_53_Prop-Interactive/SB53_stone_green_HL_01.svg'}
                    />
                </div>

                <div
                    ref={redstone}
                    style={{
                        position: 'absolute',
                        width: '12.5%',
                        height: '12.5%',
                        pointerEvents: 'none',
                        bottom: (layoutstonetPos.y + 0.225 + heightList[0] * stepRange) * 100 + '%',
                        left: (layoutstonetPos.x + 0.157) * 100 + '%'
                    }}>
                    < BaseImage
                        url={'SB_53_Prop-Interactive/SB53_stone_Red_HL_01.svg'}
                    />
                </div>


                {
                    Array.from(Array(4).keys()).map(value =>
                        <BaseImage
                            scale={0.25}
                            ref={characterList[value]}
                            posInfo={{
                                l: layoutstonetPos.x + 0.03 + [0, 0.03, 0.06, 0.1][value],
                                b: layoutstonetPos.y + 0.15 + [0, 0.04, 0.08, 0.04][value]
                            }}
                            url={'animations/SB53_hen_pose_0' + [value + 1] + '.svg'}
                        />
                    )
                }

                <div
                    ref={henAnimation}
                    style={{
                        position: "absolute", width: '15%',
                        left: (layoutstonetPos.x + 0.06) * 100 + '%'
                        , bottom: (layoutstonetPos.y + 0.22) * 100 + '%',
                        pointerEvents: 'none'
                    }}>
                    <Lottie autoplay loop options={returnOption(2)}
                        mouseDown={false}
                        isStopped={isStopAni}
                        isClickToPauseDisabled={true}
                    />
                </div>
            </div>

            <div
                style={{
                    position: "fixed", width: _geo.width * 0.25 + "px",
                    right: _geo.width * (0.01) + 'px'
                    , top: 0.04 * _geo.height + 'px'
                }}>
                <BaseImage
                    url={'SB_53_Icons/SB_53_ICON_03.svg'}
                />
            </div>

            {
                Array.from(Array(5).keys()).map(value =>
                    <div
                        style={{
                            position: "fixed", width: _geo.width * 0.042 + "px",
                            right: _geo.width * (value * 0.042 + 0.03) + 'px'
                            , top: 0.055 * _geo.height + 'px'
                        }}>
                        <BaseImage
                            url={'SB_53_Icons/ICON_01.png'}
                        />
                        <BaseImage
                            ref={starRefList[4 - value]}
                            url={'SB_53_Icons/ICON_02.png'}
                        />
                    </div>)
            }


        </div >
    );

}


export default React.forwardRef(GamePanel);