import { atom, RecoilRoot, useRecoilState } from 'recoil'
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist()

export const companySelectionState = atom({
  key: 'companySelectionState',
  default: '',
  effects_UNSTABLE: [persistAtom],
})

export const employeeSelectionState = atom({
  key: 'employeeSelectionState',
  default: {},
  effects_UNSTABLE: [persistAtom],
})