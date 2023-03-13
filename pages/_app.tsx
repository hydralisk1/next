// import '@/styles/globals.css'
import { FC } from 'react'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { wrapper } from '@/store/store'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

const App: FC<AppProps> = ({ Component, ...rest }) => {
  const {store, props} = wrapper.useWrappedStore(rest)

  return (
    <Provider store={store}>
      <main className={inter.className}>
        <Component {...props.pageProps} />
      </main>
    </Provider>
  )
}

export default App
