import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { WideContainer } from "@/components/layout/WideContainer";
import { useDebounce } from "@/hooks/useDebounce";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { HomeLayout } from "@/pages/layouts/HomeLayout";
import { BookmarksPart } from "@/pages/parts/home/BookmarksPart";
import { HeroPart } from "@/pages/parts/home/HeroPart";
import { WatchingPart } from "@/pages/parts/home/WatchingPart";
import { SearchListPart } from "@/pages/parts/search/SearchListPart";
import { SearchLoadingPart } from "@/pages/parts/search/SearchLoadingPart";

function useSearch(search: string) {
  const [searching, setSearching] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const debouncedSearch = useDebounce<string>(search, 500);
  // NOTE: useEffect
  // 在 TypeScript React 中，useEffect 是一个 React Hook 函数，它用于处理组件的副作用操作。副作用是指那些不直接与组件渲染相关的操作，比如数据获取、订阅事件、手动修改 DOM 等。
  // useEffect 接受两个参数：一个副作用函数和一个依赖数组（可选）。
  // 副作用函数会在每次组件渲染时执行。它可以执行一些异步操作、订阅事件等。如果依赖数组为空，则在每次组件更新时都会执行该函数；如果依赖数组不为空，则只有依赖项发生变化时，副作用函数才会重新执行。这有助于避免不必要的执行和内存泄漏。
  useEffect(() => {
    setSearching(search !== "");
    setLoading(search !== "");
  }, [search]);
  useEffect(() => {
    setLoading(false);
  }, [debouncedSearch]);

  return {
    loading,
    searching,
  };
}

export function HomePage() {
  const { t } = useTranslation();
  const [showBg, setShowBg] = useState<boolean>(false);
  const searchParams = useSearchQuery();
  const [search] = searchParams;
  const s = useSearch(search);

  return (
    // HomeLayout 添加 Footer
    <HomeLayout showBg={showBg}>
      <div className="mb-16 sm:mb-24">
        <Helmet>
          <title>{t("global.name")}</title>
        </Helmet>
        <HeroPart searchParams={searchParams} setIsSticky={setShowBg} />
      </div>
      {/* WideContainer 宽屏显示 */}
      <WideContainer>
        {s.loading ? (
          // 等待加载
          <SearchLoadingPart />
        ) : s.searching ? (
          // 搜索结果
          <SearchListPart searchQuery={search} />
        ) : (
          <>
            {/* 标签页 */}
            <BookmarksPart />
            {/* 正在看 */}
            <WatchingPart />
          </>
        )}
      </WideContainer>
    </HomeLayout>
  );
}
