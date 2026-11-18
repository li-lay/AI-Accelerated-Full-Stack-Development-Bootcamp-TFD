const { createApp, ref, computed } = Vue;

const app = createApp({
    setup() {
        const counter = ref(0)
        const transcations = ref([
            { "id": 1, "note": "Salary", "category": "Income", "type": "income", "amountCents": 30000 },
            { "id": 2, "note": "Lunch", "category": "Food", "type": "expense", "amountCents": 450 },
            { "id": 3, "note": "Bus", "category": "Transport", "type": "expense", "amountCents": 150 },
            { "id": 4, "note": "Notebook", "category": "Study", "type": "expense", "amountCents": 300 }
        ]
        )

        function totalCents(list) {
            return list.reduce((sum, tx) => sum + tx.amountCents, 0);
        }

        function filterByType(list, type) {
            return list.filter((tx) => tx.type === type);
        }

        function formatMoney(cents) {
            const sign = cents < 0 ? "-" : "";
            return sign + "$" + (Math.abs(cents) / 100).toFixed(2);
        }

        function summarize() {
            const incomeCents = totalCents(filterByType(transcations.value, "income"));
            const expensesCents = totalCents(filterByType(transcations.value, "expense"));
            return {
                incomeCents: incomeCents,
                expensesCents: expensesCents,
                balanceCents: incomeCents - expensesCents,
            };
        }

        const increaseCounter = () => {
            counter.value++
        }

        const filter = ref("all");

        const filteredTransactions = computed(() => {
            if (filter.value === "all") return transcations.value;
            return filterByType(transcations.value, filter.value);
        });

        function setFilter(type) {
            filter.value = type;
        }

        function resetFilter() {
            filter.value = "all";
        }

        return {
            counter,
            transcations,
            formatMoney,
            summarize,
            increaseCounter,
            filter,
            filteredTransactions,
            setFilter,
            resetFilter
        }
    }
})

app.mount("#app")