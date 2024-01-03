// NOTE: useAutoAnimate
// 是 @formkit/auto-animate/react 库中的一个自定义 Hook。它用于实现自动动画效果。
// 该库旨在为 Web 应用程序中的动画提供简化的 API。useAutoAnimate Hook 可以帮助您在 React 组件中轻松实现动画效果，而无需手动编写复杂的 CSS 或 JavaScript 动画代码。
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { EditButton } from "@/components/buttons/EditButton";
import { Icons } from "@/components/Icon";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { MediaGrid } from "@/components/media/MediaGrid";
import { WatchedMediaCard } from "@/components/media/WatchedMediaCard";
import { useBookmarkStore } from "@/stores/bookmarks";
import { useProgressStore } from "@/stores/progress";
import { MediaItem } from "@/utils/mediaTypes";

export function BookmarksPart() {
  const { t } = useTranslation();
  const progressItems = useProgressStore((s) => s.items);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);
  const removeBookmark = useBookmarkStore((s) => s.removeBookmark);
  const [editing, setEditing] = useState(false);
  const [gridRef] = useAutoAnimate<HTMLDivElement>();

  const items = useMemo(() => {
    let output: MediaItem[] = [];
    // NOTE: Object.entries(bookmarks)
    // 这个部分将 bookmarks 对象转换成一个由键值对组成的数组。每个键值对会以 [key, value] 的形式表示，其中 key 是对象属性名，value 是对应的属性值。
    // Input:
    // const person = {
    //   name: 'John',
    //   age: 30,
    //   city: 'New York'
    // };
    // Output:
    // [
    //   ["name", "John"],
    //   ["age", 30],
    //   ["city", "New York"]
    // ]

    // NOTE: forEach 用法
    Object.entries(bookmarks).forEach((entry) => {
      output.push({
        id: entry[0],
        ...entry[1],
      });
    });
    output = output.sort((a, b) => {
      const bookmarkA = bookmarks[a.id];
      const bookmarkB = bookmarks[b.id];
      const progressA = progressItems[a.id];
      const progressB = progressItems[b.id];

      const dateA = Math.max(bookmarkA.updatedAt, progressA?.updatedAt ?? 0);
      const dateB = Math.max(bookmarkB.updatedAt, progressB?.updatedAt ?? 0);

      return dateB - dateA;
    });
    return output;
  }, [bookmarks, progressItems]);

  if (items.length === 0) return null;

  return (
    <div>
      <SectionHeading
        title={t("home.bookmarks.sectionTitle") || "Bookmarks"}
        icon={Icons.BOOKMARK}
      >
        <EditButton editing={editing} onEdit={setEditing} />
      </SectionHeading>
      <MediaGrid ref={gridRef}>
        {items.map((v) => (
          <WatchedMediaCard
            key={v.id}
            media={v}
            closable={editing}
            onClose={() => removeBookmark(v.id)}
          />
        ))}
      </MediaGrid>
    </div>
  );
}
