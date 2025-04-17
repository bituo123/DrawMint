import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Excalidraw } from '../../excalidraw'
import '../../index.css'
import './whiteboard.css'
interface WhiteboardData {
  elements: any[]
  appState: any
  files: any
}

function WhiteboardPage() {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<WhiteboardData | null>(null)
  const saveTimeoutRef = useRef<NodeJS.Timeout>(null as any)

  const [showSaveIndicator, setShowSaveIndicator] = useState(false);



  const renderTopRightUI = () => {
    return (
      <button
        className="macos-button back-button"
        onClick={() => navigate('/')}
        title="返回主页"
      >
        <span className="arrow-icon">←</span>
        返回主页
      </button>
    )
  }
  // 初始化数据
  const initData = async () => {
    try {
      // 同时获取文件元数据
      const savedFiles = localStorage.getItem('excalidraw-files');
      const filesList = savedFiles ? JSON.parse(savedFiles) : [];

      // 验证文件是否存在
      const currentFile = filesList.find((f: any) => f.id === fileId);
      if (!currentFile) {
        navigate('/');
        return;
      }

      // 获取画板数据
      const savedData = localStorage.getItem('excalidraw-files-data') || "{}";
      const filesData = JSON.parse(savedData);

      // 如果不存在则初始化
      if (!filesData[fileId!]) {
        filesData[fileId!] = {
          elements: [],
          appState: {
            viewBackgroundColor: "#ffffff",
            currentItemFontFamily: 1,
            exportScale: 1,
          },
          files: null
        };
        localStorage.setItem('excalidraw-files-data', JSON.stringify(filesData));
      }

      setData(filesData[fileId!]);

    } catch (error) {
      console.error("Error loading data:", error);
      navigate('/');
    }
  }

  // 保存数据到localStorage
  const saveData = useCallback((newData: WhiteboardData) => {
    const savedFiles = localStorage.getItem('excalidraw-files');
    const filesList = savedFiles ? JSON.parse(savedFiles) : [];

    // 更新修改时间
    const updatedFiles = filesList.map((file: any) =>
      file.id === fileId ? { ...file, modifiedAt: new Date().toISOString() } : file
    );

    // 保存画板数据
    const filesData = JSON.parse(localStorage.getItem('excalidraw-files-data') || "{}");
    filesData[fileId!] = newData;

    localStorage.setItem('excalidraw-files', JSON.stringify(updatedFiles));
    localStorage.setItem('excalidraw-files-data', JSON.stringify(filesData));
  }, [fileId]);

  const handleChange = useCallback((elements: any, appState: any, files: any) => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    // setShowSaveIndicator(true);
    saveTimeoutRef.current = setTimeout(() => {
      const newData = {
        elements,
        appState: {
          ...appState,
          collaborators: appState.collaborators ? Object.values(appState.collaborators) : []
        },
        files
      }

      setData(newData)
      saveData(newData)
      // setShowSaveIndicator(false)
    }, 1000)
  }, [saveData])

  useEffect(() => {
    if (!fileId) {
      navigate('/')
      return
    }
    initData()
  }, [fileId])

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      {data && (
        <Excalidraw
          initialData={data}
          onChange={handleChange}
          langCode="zh-CN"
          gridModeEnabled
          validateEmbeddable
          renderTopRightUI={renderTopRightUI}
        />
      )}
      <div className={`auto-save-indicator ${showSaveIndicator ? 'visible' : ''}`}>
        ⚡️ 自动保存中...
      </div>
    </div>
  )
}

export default WhiteboardPage