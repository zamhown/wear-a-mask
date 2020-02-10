export default {
    language: 'English',
    title: 'Wear a Mask on Your Avatar!',
    logo: {
        filename: 'logo-title-en.svg',
        height: '20'  // vh
    },
    languageBtn: {
        text: 'Language',
        width: 'auto'
    },
    languageList: {
        title: 'Select Language',
        width: '240px'
    },
    index: {
        title: {
            text: 'MASK AT CRITICAL MOMENTS!',
            letterSpacing: '1px'
        },
        slogan: {
            text1: 'Wear a mask on your SNS avatars, ',
            text2: "let's pay more attention to public health. ",
            space: ' ',
            letterSpacing: '0px'
        },
        selectImg: {
            text: 'Select an Image',
            width: '190px'
        },
        description: {
            text1: 'This page can automatically put a mask on your avatar, and you can also edit the position and size of the mask.',
            text2: "The face detection algorithm is based on the SSD MobileNet V1 neural network model. You don't need to upload pictures and the site don't retain any data.",
            letterSpacing: '0px'
        }
    },
    editor: {
        loading: {
            title: 'Face detection is in progress...',
            text1: 'Because the algorithm runs in the browser all the time,',
            text2: 'the calculation speed may depend on the performance of the device.',
            width: '280px',
            height: '144px'
        },
        reset: {
            text: 'Reset',
            width: 'auto'
        },
        changeMask: 'Change the Mask',
        reselectImg: {
            text: 'Reselect',
            width: '120px'
        },
        saveImg: {
            text: 'Save Image',
            width: '120px'
        },
    },
    export: {
        loading: {
            title: 'Exporting...',
            width: '200px',
            height: '50px'
        },
        title: 'Long Press or Right Click to Save the Image',
        backToEditor: {
            text: 'Continue Editing',
            width: '150px'
        },
        backToIndex: {
            text: 'Reselect',
            width: '90px'
        },
        share: {
            text: 'Share',
            width: 'auto'
        }
    },
    share: {
        loading: {
            title: 'Generating...',
            width: '200px',
            height: '50px'
        },
        title: 'Save the Image and Share It With Friends!',
        back: {
            text: 'Back',
            width: '120px'
        },
        shareImg: {
            filename: 'share-github-en.png',
            p0: '[157, 227]',  // left-top point of rect for user-image embeding
            p1: '[610, 679]'  // right-bottom point of rect for user-image embeding
        }
    }
 }