import { BehaviorSubject } from 'rxjs'
export class PreviewStore {
  static showCheckerboard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  static showOutline: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  static selectedComponentKey: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)
}

export default PreviewStore
