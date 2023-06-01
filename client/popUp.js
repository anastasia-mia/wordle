$('.startGameButton').on('click', () =>{
    $('.blurBackgroundOfPopUp').css('visibility', 'hidden');
})

$('.gameEnd_cross').on('click', () =>{
    $('.blurBackgroundOfGameEndPopUp').css('visibility', 'hidden');
})

$('.rules_cross').on('click', () =>{
    $('.game_rules').removeClass('visibleBlock');
})

$('.showRulesButton').on('click', () =>{
    $('.game_rules').toggleClass('visibleBlock');
})

$('.gameEnd_restartButton').on('click', () =>{
    $('.blurBackgroundOfGameEndPopUp').css('visibility', 'hidden');
    $('.board').html('');
    board.startAgain();
    keyboard.resetKeyboard();
})