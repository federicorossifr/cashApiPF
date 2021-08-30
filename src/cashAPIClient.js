class CashApiClient {
    constructor(baseUrl) {
        this.base = baseUrl
    }

    dummy() {
        return fetch("/api/v1/dummy").then(res => res.json())
    }

    allAccounts() {
        return fetch("/api/v1/accounts").then(res => res.json())
    }

    allAccountTransactions(accountId) {
        return fetch("/api/v1/accounts/"+accountId+"/transactions").then(res => res.json())
    }

    allTransactions() {
        return fetch("/api/v1/transactions").then(res => res.json())
    }
}

module.exports = CashApiClient