class CashApiClient {
    constructor(baseUrl) {
        this.base = baseUrl
    }

    dummy() {
        return fetch("/api/v1/dummy").then(res => res.json())
    }

    allTransactions() {
        return fetch("/api/v1/transactions").then(res => res.json())
    }
}