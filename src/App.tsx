import Globe from "react-globe.gl";
import {useEffect, useRef, useState} from "react";
import './app.style.css';
import {formatDate} from "./date.util";
import {fetchAI, fetchArticles} from "./server";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import Markdown from "react-markdown";
import {Object3D} from "three";
import ChatModel from "@src/chat.model";
import Loader from "./loader/Loader";
import ArticleModel from "@src/article.model";
import tagPaths, {tagScales} from "./tagPaths";

const sideBarWidth = 440;

type Model = { [key in string]: Object3D };

function App() {
    const globeRef = useRef<any>();
    const [globeRadius, setGlobeRadius] = useState();
    const [globeC, setGlobeC] = useState(0);
    const [isFolded, setIsFolded] = useState(false);
    const [isFetchedArticle, setIsFetchedArticle] = useState(false);
    const [sideBarXPos, setSideBarXPos] = useState(0);
    const [text, setText] = useState('');
    const [chats, setChats] = useState<ChatModel[]>([]);
    const [models, setModels] = useState<Model>({});
    const [isFetchChat, setIsFetchChat] = useState(false);
    const articleContainerRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const [isShowScrollDownButton, setIsShowScrollDownButton] = useState(false);
    const [articles, setArticles] = useState<ArticleModel[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<ArticleModel>();
    const handleFolded = () => {
        const startNumber = sideBarXPos;
        const endNumber = isFolded ? 0 : -sideBarWidth;
        const duration = 500; // 0.5s
        const startTime = performance.now();

        // 이징 함수 (easeInOutQuad)
        const easeInOutQuad = (t: number) => {
            return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        }

        const animateNumber = (currentTime: number) => {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const easedProgress = easeInOutQuad(progress);
            const currentNumber = Math.floor(startNumber + (endNumber - startNumber) * easedProgress);
            setSideBarXPos(currentNumber);

            if (progress < 1) {
                requestAnimationFrame(animateNumber);
            }
        }

        requestAnimationFrame(animateNumber);
    }

    useEffect(() => {
        setGlobeRadius(globeRef.current?.getGlobeRadius());

        // TODO
        // globeRef.current.pointOfView({ altitude: 3.5 });
    }, []);

    useEffect(() => {
        fetchArticles()
            .then(res => {
                setArticles(res?.data ?? []);
            });
    }, []);

    useEffect(() => {
        console.log('sex');
        console.log(Object.keys(models).length);
    }, [models]);

    useEffect(() => {
        const fetchModel = async () => {
            const fetchModels = Object.entries(tagPaths)
                .map(async (tag) => {
                    const [key, value] = tag;
                    if (!value) {
                        console.log(`key not working - ${key}`);
                        return;
                    }
                    // console.log(key, value);
                    // console.log(`value - ${value}`);
                    const loader = new GLTFLoader();
                    const model = await loader.loadAsync(value);
                    // console.log(model.scene as Object3D);
                    const object3D = model.scene as Object3D;

                    const scale = tagScales[key];
                    model.scene.scale.set(scale, scale, scale);

                    setModels(m => Object.assign(m!, {
                        [key]: object3D
                    }));
                })
            await Promise.all(fetchModels);
            setIsFetchedArticle(true);
        }
        fetchModel();
    }, []);

    const scrollChatContainerToBottom = () => {
        const chatContainer = chatContainerRef.current;
        if (!chatContainer) {
            return;
        }
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
        });
    };

    const handleSend = async (text: string) => {
        if (text === '' || text === ' ') {
            alert('내용을 입력해주세요');
            return;
        }

        setIsFetchChat(true);
        setChats(i => [
            ...i,
            {
                id: 1,
                message: text
            }
        ]);
        setText('');
        scrollChatContainerToBottom();
        const data = await fetchAI(text);
        setChats(i => [
            ...i,
            {
                id: 2,
                message: data?.data ?? ''
            }
        ]);
        setIsFetchChat(false);
    }

    const scrollArticleContainerToTop = () => {
        const articleContainer = articleContainerRef.current;
        if (!articleContainer) {
            return;
        }
        articleContainer.scrollTop = 0;
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '100vw',
                height: '100vh',
                alignItems: 'skretch',
                justifyContent: 'center',
            }}>
            <div
                style={{
                    display: 'flex',
                    position: 'fixed',
                    left: sideBarXPos,
                    top: 0,
                    bottom: 0,
                    flexDirection: 'column',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    borderColor: 'rgba(246,246,246,0.12)',
                    borderStyle: 'solid',
                    borderWidth: '1px',
                    flexGrow: 1,
                    width: `${sideBarWidth}px`,
                    alignSelf: 'skretch',
                    justifyContent: 'skretch',
                    margin: '20px',
                    borderRadius: '8px',
                    zIndex: 100,
                }}
                className={'bg-blur-24'}
            >
                <div
                    style={{
                        color: 'white',
                        padding: '12px',
                        alignSelf: 'skretch',
                        borderWidth: '0 0 1px 0',
                        borderStyle: 'solid',
                        borderColor: 'rgba(246,246,246,0.16)',
                    }}
                >
                    Article
                </div>
                {/* scrollable */}
                <div
                    ref={articleContainerRef}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        rowGap: '12px',
                        paddingBottom: '24px'
                    }}
                >
                    {!selectedArticle && (
                        <div style={{
                            display: 'flex',
                            color: 'rgba(237,237,237,0.68)',
                            justifyContent: 'center',
                            alignItems: 'center',
                            alignSelf: 'skretch',
                            justifySelf: 'skretch',
                            marginTop: '380px',
                            fontSize: '18px',
                        }}>
                            지구본에서 사회문제를 클릭해보세요
                        </div>
                    )}
                    {selectedArticle && (
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '12px 16px',
                            }}>
                            <div
                                style={{
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    wordWrap: 'break-word',
                                    lineHeight: '32px',
                                }}
                            >{selectedArticle.title}</div>
                            <div style={{
                                color: 'rgba(255,255,255,0.7)',
                                marginTop: '4px',
                            }}>{formatDate(new Date(selectedArticle.createdAt))}</div>
                            <img
                                style={{
                                    marginTop: '8px',
                                    borderRadius: '8px',
                                }}
                                src={selectedArticle.imgUrl}
                                alt="널널"/>
                            <div
                                style={{
                                    color: 'white',
                                    lineHeight: '30px',
                                    marginTop: '16px',
                                    wordWrap: 'break-word',
                                }}
                            >{selectedArticle.content}</div>
                            <div style={{
                                height: '8px'
                            }}></div>
                            <div style={{
                                alignSelf: 'skretch',
                                justifySelf: 'skretch',
                                height: '1px',
                                background: 'rgba(238,238,238,0.47)',
                                margin: '20px 0'
                            }}></div>
                            <div
                                style={{
                                    color: 'white',
                                    fontSize: '20px',
                                    fontWeight: 'bold',
                                    wordWrap: 'break-word',
                                    lineHeight: '32px',
                                }}
                            >아티클을 구독해 한달마다 사회문제를 확인하시고싶으신가요?
                            </div>
                            <div
                                style={{
                                    color: 'white',
                                    lineHeight: '30px',
                                    marginTop: '16px',
                                    wordWrap: 'break-word',
                                }}
                            >아티클은 저희가 매번 작성해 매달 9800원의 가격으로 제공해드립니다. 또한 수익의 일부는 사회문제를 해결하는데 사용됩니다. 아티클을 구독해 사회문제 해결에
                                기여해보세요
                            </div>
                            <button
                                onClick={() => {
                                    window.open("https://forms.gle/egQDgrgA2TUCvuc26");
                                }}
                                style={{
                                    background: 'white',
                                    height: '54px',
                                    borderRadius: '18px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    marginTop: '24px',
                                    marginBottom: '32px',
                                    marginLeft: '12px',
                                    marginRight: '12px',
                                }}
                            >구독하기
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    position: 'fixed',
                    top: '12px',
                    left: 0,
                    right: 0,
                    color: 'rgba(255,255,255,0.69)',
                    justifyContent: 'center',
                    zIndex: 100,
                    fontSize: isFolded ? '24px' : '20px',
                    fontWeight: isFolded ? 'bold' : '200',
                    backgroundColor: isFolded ? 'transparent' : 'rgba(0,0,0,0.3)',
                    borderColor: isFolded ? 'transparent' : 'rgba(246,246,246,0.12)',
                    borderStyle: isFolded ? undefined : 'solid',
                    borderWidth: isFolded ? undefined : '1px',
                    justifySelf: 'center',
                    padding: '10px 12px',
                    borderRadius: '8px',
                }}
                className={'title'}
            >Alpha Map</div>
            {articles.length > 0 && models !== undefined && isFetchedArticle && (
                <Globe
                    key={`${Object.keys(models).length}`}
                    ref={globeRef}
                    width={window.outerWidth}
                    globeImageUrl={'./earthhd.jpg'}
                    backgroundColor={'black'}
                    bumpImageUrl={'//unpkg.com/three-globe/example/img/earth-topology.png'}
                    backgroundImageUrl={'//unpkg.com/three-globe/example/img/night-sky.png'}
                    objectLabel={'title'}
                    objectLat={"latitude"}
                    objectLng={"hardness"}
                    objectAltitude={'alt'}
                    objectFacesSurfaces={false}
                    objectsData={articles}
                    onObjectClick={(obj) => {
                        setSelectedArticle(obj as ArticleModel);
                        scrollArticleContainerToTop();
                        if (isFolded) {
                            handleFolded();
                        }
                        setIsFolded(false);
                    }}
                    objectThreeObject={(d) => models[(d as ArticleModel).tag]}
                    onGlobeClick={() => {
                        setIsFolded(i => !i);
                        handleFolded();
                    }}
                />
            )}

            <div style={{
                display: 'flex',
                position: 'fixed',
                right: sideBarXPos,
                top: 0,
                bottom: 0,
                flexDirection: 'column',
                backgroundColor: 'rgba(0,0,0,0.3)',
                borderColor: 'rgba(246,246,246,0.16)',
                flexGrow: 1,
                width: `${sideBarWidth}px`,
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: '8px',
                zIndex: 100,
                margin: '20px'
            }}
                 className={'bg-blur-24'}
            >
                <div
                    style={{
                        color: 'white',
                        padding: '12px',
                        alignSelf: 'skretch',
                        borderWidth: '0 0 1px 0',
                        borderStyle: 'solid',
                        borderColor: 'rgba(246,246,246,0.16)',
                    }}
                >
                    Chat
                </div>
                {/* scrollable */}
                <div
                    ref={chatContainerRef}
                    onScroll={(e) => {
                        const container = e.target as HTMLDivElement;
                        // console.log(container.scrollTop, container.scrollHeight, container.offsetHeight);
                        const isShowScrollDown = container.scrollHeight - container.scrollTop > container.offsetHeight + 100;
                        setIsShowScrollDownButton(isShowScrollDown);
                    }}
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        overflowY: 'auto',
                        rowGap: '28px',
                        paddingBottom: '92px',
                        paddingTop: '16px',
                    }}
                >
                    {!(chats.length > 0) && (
                        <div
                            style={{
                                display: 'flex',
                                color: 'rgba(238,238,238,0.7)',
                                fontSize: '18px',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                marginTop: '12px',
                                backgroundColor: 'rgba(255,255,255,0.08)',
                                padding: '12px 16px',
                                borderRadius: '8px',
                            }}
                        >
                            첫 대화를 시작해보세요
                        </div>
                    )}
                    {chats.map((i, idx) => {
                        const isMe = i.id === 1;
                        return (
                            <div key={idx} style={{
                                display: 'flex',
                                padding: '12px 16px',
                                flexDirection: 'column',
                                background: isMe ? 'rgba(255,255,255,0.07)' : 'transparent',
                                borderRadius: '8px 0 8px 8px',
                                marginLeft: isMe ? '64px' : 0,
                                marginRight: isMe ? '16px' : 0
                            }}>
                                {!isMe && <span style={{
                                    color: 'rgba(255,255,255,0.67)',
                                    fontWeight: '500',
                                    fontSize: '20px',
                                    marginBottom: '8px'
                                }}>답변</span>}
                                <div
                                    style={{
                                        backgroundColor: 'transparent',
                                        borderRadius: isMe ? '8px 0 8px 8px' : '0 8px 8px 8px',
                                        fontWeight: '500',
                                        fontSize: '16px',
                                        color: 'white',
                                        lineHeight: '28px',
                                        wordBreak: 'break-word',
                                    }}
                                    className={'chat-content'}
                                >
                                    <Markdown>{i.message}</Markdown>
                                </div>
                                <div
                                    style={{
                                        color: 'rgba(255,255,255,0.53)',
                                        fontWeight: '300',
                                        fontSize: '13px',
                                        whiteSpace: 'nowrap',
                                    }}
                                >오후 7:44
                                </div>
                            </div>
                        );
                    })}
                    {isFetchChat && <div style={{
                        display: 'flex',
                        justifySelf: 'stretch',
                        justifyContent: 'center',
                    }}><Loader/></div>}
                </div>
                {isShowScrollDownButton &&
                    <button
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            bottom: '128px',
                            left: 0,
                            right: 0,
                            backgroundColor: 'rgba(0,0,0,0.9)',
                            borderColor: 'rgba(246,246,246,0.16)',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            alignSelf: 'center',
                            justifySelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onClick={() => {
                            scrollChatContainerToBottom();
                        }}
                        className={'fadein'}
                    >
                        <svg width="28" height="28" viewBox="0 0 24 24" fill={"rgba(255,255,255,0.74)"}
                             xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M19.7071 12.8107C20.0976 12.4201 20.0976 11.787 19.7071 11.3964C19.3166 11.0059 18.6834 11.0059 18.2929 11.3964L12.8839 16.8055L12.8839 5C12.8839 4.5 12.5 4 12 4C11.4788 4 11.1161 4.5 11.1161 5V16.8055L5.70711 11.3964C5.31658 11.0059 4.68342 11.0059 4.29289 11.3964C3.90237 11.787 3.90237 12.4201 4.29289 12.8107L11.1161 19.6339C11.6043 20.122 12.3957 20.122 12.8839 19.6339L19.7071 12.8107Z"
                            />
                        </svg>
                    </button>
                }

                {!(chats.length > 0) && (
                    <div
                        style={{
                            display: 'flex',
                            position: 'absolute',
                            bottom: '82px',
                            marginBottom: '84px',
                            margin: '0 16px',
                            zIndex: 30000,
                            columnGap: '8px'
                        }}
                    >
                        {['요즘 집 값이 높은 이유', '세계적인 사회 문제'].map((i, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    handleSend(i).then();
                                }}
                                style={{
                                    background: 'rgba(113,113,113,0.17)',
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                    borderColor: '#5a5a5a',
                                    borderRadius: '8px',
                                    paddingRight: '6px',
                                    color: 'white',
                                    padding: '8px 12px',
                                    fontSize: '16px'
                                }}
                            >
                                {i}
                            </button>
                        ))}
                    </div>
                )}
                <div
                    style={{
                        display: 'flex',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        margin: '0 16px',
                        marginBottom: '16px',
                        height: '59px',
                        background: 'rgba(0,0,0,1)',
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: '#5a5a5a',
                        borderRadius: '8px',
                        alignItems: 'center',
                        paddingRight: '6px',
                        zIndex: 30000,
                    }}
                    className={'chat-input-container'}
                >
                    <input
                        value={text}
                        onChange={e => {
                            setText(e.target.value);
                        }}
                        style={{
                            display: 'flex',
                            flexGrow: 1,
                            border: 'none',
                            outline: 'none',
                            background: 'none',
                            padding: '20px 0',
                            paddingLeft: '16px',
                            fontWeight: '500',
                            fontSize: '16px',
                            marginRight: '8px',
                            color: 'white'
                        }}
                        className={'chat-input'}
                        type="text" placeholder={'내용을 입력해주세요'}/>
                    <button
                        style={{
                            padding: '6px',
                            backgroundColor: 'transparent',
                            borderRadius: '50%',
                            width: '44px',
                            height: '44px',
                            cursor: 'pointer',
                            border: 'none'
                        }}
                        disabled={isFetchChat}
                        onClick={() => handleSend(text)}
                    >
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M26.6327 26.6961C27.1807 26.8179 27.6247 26.2493 27.3736 25.7472L16.5963 4.19256C16.3506 3.70119 15.6494 3.70119 15.4037 4.19256L4.62641 25.7472C4.37537 26.2493 4.81933 26.8179 5.36732 26.6961L13.0795 24.8342C13.6312 24.7116 14.0456 24.2545 14.1139 23.6936L15.8662 14.096C15.8672 14.0909 15.8677 14.0852 15.8679 14.08C15.8882 13.2698 16.1134 13.9325 16.1324 14.0883L17.8862 23.6936C17.9544 24.2545 18.3689 24.7116 18.9205 24.8342L26.6327 26.6961Z"
                                fill={isFetchChat ? '#5e5f60' : "#F21D1D"}/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default App;