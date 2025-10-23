'use client';

import { useState } from 'react';
import GuideNavigator from './components/GuideNavigator';
import GuideContent from './components/GuideContent';

export default function ParasolAppPage() {
  const [selectedGuidePath, setSelectedGuidePath] = useState<string | null>(null);

  return (
    <div className="h-screen flex">
      {/* 左サイドバー: ガイドナビゲーション */}
      <div className="w-80 flex-shrink-0">
        <GuideNavigator
          selectedPath={selectedGuidePath}
          onSelectGuide={setSelectedGuidePath}
        />
      </div>

      {/* メインコンテンツ: ガイド表示 */}
      <div className="flex-1">
        <GuideContent guidePath={selectedGuidePath} />
      </div>
    </div>
  );
}
