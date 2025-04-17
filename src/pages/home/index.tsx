// home.tsx 修改后的代码
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './home.css' // 新增CSS文件

interface FileInfo {
    id: string
    name: string
    createdAt: string
}

function HomePage() {
    const navigate = useNavigate()
    const [files, setFiles] = useState<FileInfo[]>([])

    const [selectedFiles, setSelectedFiles] = useState<string[]>([])
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null)
    const [contextMenuPos, setContextMenuPos] = useState<{ x: number; y: number } | null>(null)
    const [renamingId, setRenamingId] = useState<string | null>(null)
    // 新增hook
    const contextMenuRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        const savedFiles = localStorage.getItem('excalidraw-files')
        if (savedFiles) {
            setFiles(JSON.parse(savedFiles))
        }
    }, [])
    // 关闭菜单的effect
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setContextMenuPos(null)
            }
        }

        if (contextMenuPos) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [contextMenuPos])

    const createNewFile = () => {
        const newFile = {
            id: Date.now().toString(),
            name: `未命名文件_${files.length + 1}`,
            createdAt: new Date().toISOString(),
            // 新增最后修改时间
            modifiedAt: new Date().toISOString()
        };

        // 初始化画板数据
        const savedData = localStorage.getItem('excalidraw-files-data') || "{}";
        const filesData = JSON.parse(savedData);
        filesData[newFile.id] = {
            elements: [],
            appState: {
                viewBackgroundColor: "#ffffff",
                currentItemFontFamily: 1,
                exportScale: 1,
            },
            files: null
        };

        const updatedFiles = [...files, newFile];

        localStorage.setItem('excalidraw-files', JSON.stringify(updatedFiles));
        localStorage.setItem('excalidraw-files-data', JSON.stringify(filesData));
        navigate(`/draw/${newFile.id}`);
    }
    // 多选处理
    const handleSelect = (id: string, e: React.MouseEvent) => {
        if (e.metaKey || e.ctrlKey) { // Command/Ctrl 多选
            setSelectedFiles(prev =>
                prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
            )
        } else {
            setSelectedFiles([id])
        }
    }

    // 拖拽排序
    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.dataTransfer.effectAllowed = "move"
        setDraggingIndex(index)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        if (draggingIndex === null || draggingIndex === index) return

        setFiles(prev => {
            const newFiles = [...prev]
            const [removed] = newFiles.splice(draggingIndex, 1)
            newFiles.splice(index, 0, removed)
            setDraggingIndex(index)
            return newFiles
        })
    }

    // 右键菜单
    const handleContextMenu = (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        if (!selectedFiles.includes(id)) {
            setSelectedFiles([id])
        }
        setContextMenuPos({ x: e.clientX, y: e.clientY })
    }

    // 重命名功能
    const handleRename = (id: string, newName: string) => {
        const updatedFiles = files.map(file =>
            file.id === id ? { ...file, name: newName } : file
        );

        // 同步更新画板数据中的文件名
        const filesData = JSON.parse(localStorage.getItem('excalidraw-files-data') || "{}");
        if (filesData[id]) {
            filesData[id].appState.name = newName;
            localStorage.setItem('excalidraw-files-data', JSON.stringify(filesData));
        }

        localStorage.setItem('excalidraw-files', JSON.stringify(updatedFiles));
        setFiles(updatedFiles);
        setRenamingId(null);
    }

    return (
        <div className="finder-container">
            <header className="finder-header">
                <h1>我的绘图文件</h1>
                <button className="macos-button" onClick={createNewFile}>
                    <span className="plus-icon">+</span>
                    新建文件
                </button>
            </header>

            <div className="finder-grid-view">
                {files.map((file, index) => (
                    <div
                        key={file.id}
                        className={`finder-item ${selectedFiles.includes(file.id) ? 'selected' : ''}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onClick={(e) => handleSelect(file.id, e)}
                        onContextMenu={(e) => handleContextMenu(e, file.id)}
                        onDoubleClick={() => {
                            if (renamingId) return
                            navigate(`/draw/${file.id}`)
                        }}
                    >
                        {/* 在file-name处添加重命名输入框 */}
                        <div className="file-name">
                            {renamingId === file.id ? (
                                <input
                                    type="text"
                                    className="rename-input"
                                    defaultValue={file.name}
                                    autoFocus
                                    onBlur={(e) => handleRename(file.id, e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleRename(file.id, (e.target as HTMLInputElement).value)
                                        }
                                    }}
                                />
                            ) : (
                                file.name
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {contextMenuPos && (
                <div
                    ref={contextMenuRef}
                    className="context-menu"
                    style={{
                        position: 'fixed',
                        left: contextMenuPos.x,
                        top: contextMenuPos.y,
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <div className="menu-item" onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(files.find(f => f.id === selectedFiles[0])))
                        setContextMenuPos(null)
                    }}>复制</div>
                    <div className="menu-item" onClick={() => {
                        setFiles(files.filter(f => !selectedFiles.includes(f.id)))
                        localStorage.setItem('excalidraw-files', JSON.stringify(files))
                        setContextMenuPos(null)
                    }}>删除</div>
                    <div className="menu-item" onClick={() => {
                        setRenamingId(selectedFiles[0])
                        setContextMenuPos(null)
                    }}>重命名</div>
                </div>
            )}


        </div>
    )
}

export default HomePage