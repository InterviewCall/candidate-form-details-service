// The steps of the VSL follow-up chain.
// The name tells the day and what happens.
export enum VslStepKey {
    // Day 1: recovery email
    // "You checked this yesterday - one thing before you move on"
    VSL_D1_EMAIL = 'VSL_D1_EMAIL',

    // Day 3: Abhinay proof email
    VSL_D3_EMAIL = 'VSL_D3_EMAIL',

    // Day 7: closing email
    // "Should we close this for now?"
    VSL_D7_EMAIL = 'VSL_D7_EMAIL'
}