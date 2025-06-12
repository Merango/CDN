import { describe, it, expect } from 'vitest';
import { ethers } from 'hardhat';
import { Lottery } from '../src/contracts/Lottery.sol';

describe('Lottery Contract - Round Data Retrieval', () => {
    let lottery: Lottery;
    let owner: any;
    let participants: any[];

    beforeEach(async () => {
        const [deployer, ...otherAccounts] = await ethers.getSigners();
        owner = deployer;
        participants = otherAccounts.slice(0, 5);

        const LotteryFactory = await ethers.getContractFactory('Lottery');
        lottery = await LotteryFactory.deploy();
    });

    it('should record a lottery round correctly', async () => {
        const participantAddresses = participants.map(p => p.address);
        const potAmount = ethers.parseEther('10');
        const winner = participants[0].address;

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const totalRounds = await lottery.getTotalRounds();
        expect(totalRounds).toBe(1n);

        const round = await lottery.getLotteryRound(1);
        expect(round.roundId).toBe(1n);
        expect(round.potAmount).toBe(potAmount);
        expect(round.winner).toBe(winner);
    });

    it('should retrieve round participants', async () => {
        const participantAddresses = participants.map(p => p.address);
        const potAmount = ethers.parseEther('10');
        const winner = participants[0].address;

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const retrievedParticipants = await lottery.getRoundParticipants(1);
        expect(retrievedParticipants).toEqual(participantAddresses);
    });

    it('should get total rounds', async () => {
        const participantAddresses = participants.map(p => p.address);
        const potAmount = ethers.parseEther('10');
        const winner = participants[0].address;

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const totalRounds = await lottery.getTotalRounds();
        expect(totalRounds).toBe(2n);
    });

    it('should retrieve recent rounds', async () => {
        const participantAddresses = participants.map(p => p.address);
        const potAmount = ethers.parseEther('10');
        const winner = participants[0].address;

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const recentRounds = await lottery.getRecentRounds(2);
        expect(recentRounds.length).toBe(2);
        expect(recentRounds[0].roundId).toBe(3n);
        expect(recentRounds[1].roundId).toBe(2n);
    });

    it('should throw error for invalid round retrieval', async () => {
        await expect(lottery.getLotteryRound(1)).rejects.toThrow('Invalid round ID');
    });
});