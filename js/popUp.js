$('.startGameButton').on('click', () =>{
    $('.blurBackgroundOfPopUp').css('visibility', 'hidden');
})

$('.gameEnd_cross').on('click', () =>{
    $('.blurBackgroundOfGameEndPopUp').css('visibility', 'hidden');
})

$('.gameEnd_restartButton').on('click', () =>{
    $('.blurBackgroundOfGameEndPopUp').css('visibility', 'hidden');
    $('.board').html('');
    board.startAgain();
    keyboard.resetKeyboard();
})