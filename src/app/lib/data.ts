// import postgres from 'postgres'

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// export async function fetchPatches() {
//     try {
        
//     }
// }

// TODO make definitions
export function fetchPatches() {
    const numPatches = 3
    const patches = [
        {
            name: "top-bed"
        },
        {
            name: "mid-bed"
        },
        {
            name: "bot-bed"
        },
    ]

    return {
        numPatches,
        patches
    }
}