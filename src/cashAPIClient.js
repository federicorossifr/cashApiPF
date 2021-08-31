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

    addAccountTransaction(accountId,transaction) {
        const opts = {method:'POST', body:JSON.stringify(transaction), headers:{'Content-Type': 'application/json'}}
        return fetch("/api/v1/accounts/"+accountId+"/transactions",opts).then(res => res.json())
    }

    addAccount(account) {
        const opts = {method:'POST', body:JSON.stringify(account), headers:{'Content-Type': 'application/json'}}
        return fetch("/api/v1/accounts/",opts).then(res => res.json())
    }
}

module.exports = CashApiClient