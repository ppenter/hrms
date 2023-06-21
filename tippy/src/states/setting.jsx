import { atom, RecoilRoot, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const triggerState = atom({
  key: 'triggerState',
  default: false,
})

export const seedsState = atom({
    key: 'seedsState',
    default: {},
  })