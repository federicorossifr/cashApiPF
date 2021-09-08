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

    updateAccount(accountId,newAccount) {
        const opts = {method:'PUT', body:JSON.stringify(newAccount), headers:{'Content-Type': 'application/json'}}
        return fetch("/api/v1/accounts/"+accountId,opts).then(res => res.json())
    }

    uploadAccountTransactions(accountId,file) {
        const data = new FormData()
        data.append('transactionFile',file)
        const opts = {method:'POST', body:data}
        return fetch("/api/v1/accounts/"+accountId+"/transactions/import",opts).then(res => res.json())
    }

    getAggregatedAccounts() {
        return fetch("/api/v1/accounts/aggregate").then(res => res.json())
    }


    getAggregatedCategories(accountId) {
        if(!accountId)
            return fetch("/api/v1/categories/aggregate").then(res => res.json())
        else
            return fetch("/api/v1/accounts/"+accountId+"/transactions/aggregate").then(res=> res.json())
    }

    getAggregatedByMonthYear() {
        return fetch("/api/v1/test").then(res => res.json())
    }

    deleteAccount(accountId) {
        const opts = {method:'DELETE', body:JSON.stringify({}), headers:{'Content-Type': 'application/json'}}
        return fetch("/api/v1/accounts/"+accountId,opts).then(res => res.json())
    }
}

module.exports = CashApiClient