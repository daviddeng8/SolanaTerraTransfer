import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import { Wallet } from '../components/wallet'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Alice Webapp for Cross Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full h-full flex-col items-center justify-center px-20 text-center">
        <Wallet />
      </main>
    </div>
  )
}

export default Home
