# Notes

Just some partially incoherent ramblings. Not meant to be read by anyone but me.

- Parse de config file
- Zoek de ene export type
- (valideer shape)
- Verzamel alle type references (?) die in het export type voorkomen
- Maak een functie die hier een string van kan teruggeven.

https://ts-ast-viewer.com/#code/PTAEEsFsAcHsCcAuoDeoAqUCmBnRBDGUAX1ADN5ZJQAiM8eLAI3xywFp8ATScAO2D1GeBFhoBuAFCSsADzhJQiAJ7QsoAIKIAFgBssidQF5Uk0KD6EsALlB54-AOZTz+RzYsBXSEyzwXdgDW4Lq6OLYoZuagAMa2TLCw+vh8AeZctvZOANoAumlKntD6ttlZfI4ANF4+fvlRxAFFXPiGXAD6rQD8tnzevv5RIKDNrVgd3baYkLgEMFKN0ipqoACiAG5YfMgmkeaWM5mIDhUBylj48L39fgtSksvqALLj+Lqgu1FYm9vt4Bl2Y5OAKPWw0JiUPgALzEoAAPrQcCFNvAaPDaI4klwJJJFjJ5AhkI9QABhJL6GKIcCwPgAEVgMW8W0Q6FUuA+pnMlFgiAiUVcOn0hnCmkFBiwBW+zJFG2ZAUW5hwniYfOioFaenFIr2atAMxaYVsLwNBQVJDuQA

Ik denk dat de gegenereerde facade functie ONDER de code van de config moet
komen te staan. Anders moeten we oneindig complex gaan doen met resolven van
types. Dat gaat nooit lukken.

In de file genereren we een delimiter comment, en bij subsequent generate
replacen we de code vanaf de delimiter.

Is dat echt nodig? Kunnen we niet gewoon een file ernaast zetten en het export
type gebruiken in de gegenereerde code daar? Dat zou voor de compiler toch niet
uit moeten maken?
