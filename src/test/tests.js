'use strict';
const expect = chai.expect;
const should = chai.should();

describe('typoz-game unit tests', function() {
    describe('adding a new word', () => {
        let testWord;
        beforeEach(() => {
            testWord = 'cheese';
            Game.addNewWord(testWord);
        });
        it('should add the word cheese to the words array', () => {
            expect(Game.wordsInGame[1].word).to.equal(testWord);
        });
        it('should set the active letter to the first letter of the word', () => {
            expect(Game.wordsInGame[1].activeLetter).to.equal(testWord.charAt(0));
        });
    });
});
