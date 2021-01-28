declare class Index {
    syncPendingTransactions: () => Promise<void>;
    run(startNum: number, maxNum: number, repairBlockNumber?: number): Promise<void>;
    private pickOuts;
    private convertToBRS;
}
export default Index;
