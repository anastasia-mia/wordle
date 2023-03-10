class Board {
    #words = ['about', 'alert', 'argue', 'above', 'alike', 'arise', 'abuse', 'alive', 'actor', 'allow', 'aside',
        'acute', 'alone', 'asset', 'admit', 'audio', 'adopt', 'after', 'audit', 'adult', 'among', 'avoid',
        'anger', 'award', 'agent', 'angry', 'began', 'below', 'beach', 'bench', 'birth', 'black', 'blood', 'board',
        'buyer', 'basis', 'china', 'cover', 'cable', 'craft', 'civil', 'clear', 'cross', 'crowd', 'chart', 'coast',
        'dance', 'daily', 'death', 'debut', 'delay', 'doubt', 'draft', 'drama', 'dream', 'dress', 'drive', 'entry',
        'equal', 'event', 'exact', 'faith', 'false', 'fruit', 'fully', 'funky', 'front', 'frame', 'forum', 'group',
        'guard', 'guess', 'guest', 'guide', 'grace', 'grade', 'grass', 'happy', 'heart', 'horse', 'hotel', 'house',
        'human', 'index', 'issue', 'irony', 'juice', 'judge', 'metal', 'media', 'money', 'music', 'minus', 'model',
        'month', 'motor', 'magic', 'mouse', 'movie', 'mouth', 'legal', 'level', 'light', 'limit', 'order', 'paper',
        'party', 'power', 'peace', 'panel', 'phase', 'phone', 'photo', 'piece', 'place', 'plane', 'point', 'plate',
        'proof', 'radio', 'range', 'right', 'river', 'route', 'royal', 'scene', 'scope', 'score', 'sense', 'seven',
        'shape', 'sharp', 'style', 'sugar', 'super', 'suite', 'sport', 'sight', 'state', 'start', 'skill', 'stick',
        'smart', 'stone', 'space', 'stuff', 'title', 'today', 'topic', 'touch', 'thank', 'texas', 'theme', 'thick',
        'trial', 'trust', 'twice', 'three', 'urban', 'usage', 'union', 'unity', 'woman', 'world', 'watch', 'white',
        'water', 'vital', 'voice', 'valid', 'vowel', 'value'];
    #element;
    #textContainer;
    DELETE_KEYCODE = 'Backspace';
    CONFIRM_KEYCODE = 'Enter';
    currentArray;
    blockId;
    chosenWord;

    constructor(board, blockId) {
        this.boardSelector = board;
        this.blockId = blockId;
        this.board = $(this.boardSelector);
        this.currentArray = [];
        this.clickHandler = this.fillBoard.bind(this)
        $(document).on('keydown', this.clickHandler);
    }

    createBoard() {
        for (let i = 1; i <= 30; i++) {
            this.#element = $('<div></div>');
            this.#textContainer = $('<span></span>');
            this.#element.addClass('singleDiv');
            this.#element.append(this.#textContainer)
            this.board.append(this.#element);
        }
    }

    chooseWord() {
        let randomIndex = Math.floor(Math.random() * this.#words.length)
        this.chosenWord = this.#words[randomIndex];
    }

    insertSymbol(key) {
        let currentBlock = $('.board :nth-child(' + this.blockId + ')');
        let currentTextContainer = $('.board :nth-child(' + this.blockId + ') > span');
        currentTextContainer.text(key.toUpperCase());
        this.currentArray.push(key.toLowerCase());
        this.animateInserting(currentBlock);
    }

    deleteSymbol() {
        if (this.blockId <= 1) this.blockId = 1;
        this.currentArray.pop();
        $('.board :nth-child(' + this.blockId + ') > span').text('');
        this.animateDeleting();
    }

    animateInserting(currentBlock) {
        currentBlock.css({
            border: '2px solid gray',
        });
        $('.singleDiv > span').css({
            border: 'none', backgroundColor: 'transparent'
        });
    }

    animateDeleting() {
        $('.board :nth-child(' + this.blockId + ')').css({
            border: '1px solid darkslategray',
        })
        $('.singleDiv > span').css({
            border: 'none',
        });
    }

    rotateBlock(index, color) {
        $('.board :nth-child(' + index + ')').addClass('startAnimation');
        keyboard.paintBlock($('.board :nth-child(' + index + ') > span').text(), color);
        setTimeout(function () {
            $('.board :nth-child(' + index + ')').css({
                backgroundColor: color, color: 'white',
            });
            $('.singleDiv > span').css({
                backgroundColor: 'transparent', color: 'inherit',
            });
        }, 50);
    }

    animateVictory(currentIndex){
        let currentBlockIndex = currentIndex - 3;
        let lastBlockIndex = currentBlockIndex + 5;
        let interval = setInterval(function(){
            $('.board :nth-child(' + currentBlockIndex + ')').addClass('victory');
            currentBlockIndex ++;
            if(currentBlockIndex === lastBlockIndex){
                clearInterval(interval);
            }
        }, 100)
    }

    getAllIndex(startIndex, randomArray) {
        let guessedIndexes = [];
        let insertedIndexes = [];
        let futureUsedInsertedIndexes = [];
        $.each(randomArray, (index, elementArray) => {
            if (elementArray === this.currentArray[startIndex]) {
                guessedIndexes.push(index);
            }
        })
        $.each(this.currentArray, (index, elementArray) => {
            if (elementArray === this.currentArray[startIndex]) {
                insertedIndexes.push(index);
            }
        })

        guessedIndexes.forEach(element => {
            let temporaryArray;
            if (insertedIndexes.includes(element)) {
                temporaryArray = insertedIndexes.splice($.inArray(element, insertedIndexes), 1);
                futureUsedInsertedIndexes.push(temporaryArray[0]);
            } else {
                temporaryArray = insertedIndexes.splice(0, 1);
                futureUsedInsertedIndexes.push(temporaryArray[0]);
            }
        })

        return {
            guessedIndexes: guessedIndexes,
            insertedIndexes: futureUsedInsertedIndexes
        };
    }

    checkWord() {
        let randomArray = this.chosenWord.split('');
        let currentIndex = this.blockId - 6;
        let startIndex = 0;
        let greenBlocks = 0;
        let gameInterval = setInterval(function () {
            let guessingAndInserting = board.getAllIndex(startIndex, randomArray);
            if (guessingAndInserting.guessedIndexes.includes(startIndex)) {
                greenBlocks++;
                board.rotateBlock(currentIndex + 1, '#437C17');
                if (greenBlocks === 5) {
                    board.animateVictory(currentIndex)
                    board.removeEvent();
                    setTimeout( function(){
                        board.callPopup('You WON!', '#437C17');
                    }, 1500);
                }
            } else if (guessingAndInserting.insertedIndexes.includes(startIndex) && guessingAndInserting.guessedIndexes.length !== 0) {
                board.rotateBlock(currentIndex + 1, '#FDD017');
            } else {
                board.rotateBlock(currentIndex + 1, '#808080');
            }
            currentIndex++;
            startIndex++;
            if (startIndex === 5) {
                clearInterval(gameInterval);
                board.currentArray = [];
                if($('.board :nth-child(30)').hasClass('startAnimation') && greenBlocks !== 5){
                    setTimeout( function(){
                        board.callPopup('You LOST!', '#C0392B');
                    }, 1000);
                }
            }
        }, 300, currentIndex);
    }

    removeEvent(){
        $(document).off('keydown', this.clickHandler);
    }

    fillBoard(e) {
        if (this.currentArray.length === 5) {
            if (e.code === this.CONFIRM_KEYCODE) {
                this.checkWord();
            }
            if (e.code === this.DELETE_KEYCODE) {
                if ($('.board :nth-child(' + (this.blockId - 1) + ')').hasClass('startAnimation')) return;
                this.blockId--;
                this.deleteSymbol();
            }
        } else {
            if (e.keyCode >= 65 && e.keyCode <= 90) {
                this.insertSymbol(e.key);
                this.blockId++;
            } else if (e.code === this.DELETE_KEYCODE) {
                if ($('.board :nth-child(' + (this.blockId - 1) + ')').hasClass('startAnimation')) return;
                this.blockId--;
                this.deleteSymbol();

            }
        }
    }

    startAgain(){
        board.createBoard();
        board.chooseWord();
        this.clickHandler = this.fillBoard.bind(this)
        $(document).on('keydown', this.clickHandler);
        this.currentArray = [];
        this.blockId = 1;
    }

    callPopup(status, color){
        $('.blurBackgroundOfGameEndPopUp').css('visibility', 'visible');
        $('.gameEnd_status').text(status);
        $('.gameEnd_word').text(this.chosenWord).css('color', color);
    }
}

class virtualKeyboard{
    #keyboardLetters = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o','p', '\n', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k',
        'l','\n', 'z', 'x', 'c', 'v', 'b', 'n', 'm'];

    #keyboardRow

    #keyboardElement
    constructor(keyboard){
        this.keyboardSelector = keyboard;
        this.keyboard = $(this.keyboardSelector);

    }

    createKeyboard(){
        let startIndex = 0;
        for (let i =0; i <=2; i++){
            this.#keyboardRow = $('<div></div>');
            this.#keyboardRow.addClass('keyboardRow');
            let stopIndex = $.inArray('\n', this.#keyboardLetters);
            for(let j = startIndex; j <= this.#keyboardLetters.length-1; j++){
                if(j === stopIndex) {
                    startIndex = stopIndex;
                    this.#keyboardLetters.splice(stopIndex,1);
                    break;
                }
                this.#keyboardElement = $('<div></div>');
                this.#keyboardElement.addClass('keyboardLetter');
                this.#keyboardElement.text(this.#keyboardLetters[j]);
                this.#keyboardRow.append(this.#keyboardElement);
            }
            this.keyboard.append(this.#keyboardRow);
        }
    }

    paintBlock(symbol, color){
        let keyboardBlocks = $('.keyboardLetter');
        $.each(keyboardBlocks, (index, element) =>{
            if(element.innerText === symbol.toLowerCase() && keyboardBlocks[index].style.backgroundColor !== 'rgb(67, 124, 23)'){
                if(keyboardBlocks[index].style.backgroundColor ==='rgb(253, 208, 23)' && color === '#808080') return;
                keyboardBlocks[index].style.backgroundColor = color;
            }
        })
    }

    resetKeyboard(){
        $.each($('.keyboardLetter'), (index, element) =>{
            $(element).css('backgroundColor', 'transparent');
        })
    }
}

let board = new Board('.board', 1);
board.createBoard();
board.chooseWord();

let keyboard = new virtualKeyboard('.virtualKeyboard');
keyboard.createKeyboard();