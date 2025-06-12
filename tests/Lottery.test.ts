import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract for testing
class MockLottery {
    private lotteryRounds: any[] = [];
    private roundCounter = 0;

    recordLotteryRound(potAmount: bigint, winner: string, participants: string[]) {
        this.roundCounter++;
        this.lotteryRounds[this.roundCounter] = {
            roundId: BigInt(this.roundCounter),
            potAmount,
            winner,
            timestamp: Date.now(),
            participants
        };
        return Promise.resolve();
    }

    getTotalRounds() {
        return Promise.resolve(BigInt(this.roundCounter));
    }

    getLotteryRound(roundId: number) {
        if (roundId <= 0 || roundId > this.roundCounter) {
            return Promise.reject(new Error('Invalid round ID'));
        }
        return Promise.resolve(this.lotteryRounds[roundId]);
    }

    getRoundParticipants(roundId: number) {
        if (roundId <= 0 || roundId > this.roundCounter) {
            return Promise.reject(new Error('Invalid round ID'));
        }
        return Promise.resolve(this.lotteryRounds[roundId].participants);
    }

    getRecentRounds(count: number) {
        if (count <= 0) {
            return Promise.reject(new Error('Count must be positive'));
        }

        const actualCount = Math.min(count, this.roundCounter);
        const recentRounds = this.lotteryRounds.slice(-actualCount).reverse();
        return Promise.resolve(recentRounds);
    }
}

describe('Lottery Round Data Retrieval', () => {
    let lottery: MockLottery;

    beforeEach(() => {
        lottery = new MockLottery();
    });

    it('should record a lottery round correctly', async () => {
        const participantAddresses = ['0x1', '0x2', '0x3'];
        const potAmount = BigInt(1000);
        const winner = '0x1';

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const totalRounds = await lottery.getTotalRounds();
        expect(Number(totalRounds)).toBe(1);

        const round = await lottery.getLotteryRound(1);
        expect(Number(round.roundId)).toBe(1);
        expect(round.potAmount).toBe(potAmount);
        expect(round.winner).toBe(winner);
    });

    it('should retrieve round participants', async () => {
        const participantAddresses = ['0x1', '0x2', '0x3'];
        const potAmount = BigInt(1000);
        const winner = '0x1';

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const retrievedParticipants = await lottery.getRoundParticipants(1);
        expect(retrievedParticipants).toEqual(participantAddresses);
    });

    it('should get total rounds', async () => {
        const participantAddresses = ['0x1', '0x2', '0x3'];
        const potAmount = BigInt(1000);
        const winner = '0x1';

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const totalRounds = await lottery.getTotalRounds();
        expect(Number(totalRounds)).toBe(2);
    });

    it('should retrieve recent rounds', async () => {
        const participantAddresses = ['0x1', '0x2', '0x3'];
        const potAmount = BigInt(1000);
        const winner = '0x1';

        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);
        await lottery.recordLotteryRound(potAmount, winner, participantAddresses);

        const recentRounds = await lottery.getRecentRounds(2);
        expect(recentRounds.length).toBe(2);
    });

    it('should throw error for invalid round retrieval', async () => {
        await expect(lottery.getLotteryRound(1)).rejects.toThrow('Invalid round ID');
    });
});