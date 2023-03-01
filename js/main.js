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
        setTimeout(function () {
            $('.board :nth-child(' + index + ')').css({
                backgroundColor: color, color: 'white',
            });
            $('.singleDiv > span').css({
                backgroundColor: 'transparent', color: 'inherit',
            });
        }, 100);
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
                if (greenBlocks === 5) board.removeEvent();
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
            }
        }, 400, currentIndex);

    }

    removeEvent(){
        $(document).off('keydown', this.clickHandler);
    }

    fillBoard(e) {
        if (this.currentArray.length === 5) {
            if (e.code === this.CONFIRM_KEYCODE) {
                this.checkWord();
                // this.currentArray = [];
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
}

let board = new Board('.board', 1);
board.createBoard();
board.chooseWord()
