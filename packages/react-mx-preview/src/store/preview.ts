import { BehaviorSubject } from 'rxjs'
export class PreviewStore {
  static showCheckerboard: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  static showOutline: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  static selectedComponentKey: BehaviorSubject<string | undefined> = new BehaviorSubject<string | undefined>(undefined)
  static showCodePreview: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  static codeContent: BehaviorSubject<string> = new BehaviorSubject<string>('')

  static leftPanelSize: BehaviorSubject<number> = new BehaviorSubject<number>(250)
  static leftPanelTempSize: BehaviorSubject<number> = new BehaviorSubject<number>(250)
  static leftPanelVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  static rightPanelSize: BehaviorSubject<number> = new BehaviorSubject<number>(300)
  static rightPanelTempSize: BehaviorSubject<number> = new BehaviorSubject<number>(250)
  static rightPanelVisible: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)

  static isResizing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
}

export default PreviewStore
