import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { fetchSettings } from '@/hooks/useSiteSettings';

interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

interface ContributionData {
  total: Record<string, number>;
  contributions: ContributionDay[];
}

interface WeekCell {
  date: string;
  count: number;
  level: number;
  day: number;
}

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP; // 14px
const SNAKE_MAX_LENGTH = 30;
const SNAKE_SPEED = 150; // ms per step
const RESET_DELAY = 1500; // ms pause before restart

export function ContributionGraph() {
  const [data, setData] = useState<ContributionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [githubUsername, setGithubUsername] = useState('sicheng-svg');

  // Snake state managed via ref for performance (avoids re-render per step)
  const [, forceRender] = useState(0);
  const [restartKey, setRestartKey] = useState(0);
  const snakeRef = useRef<{
    body: { week: number; day: number }[];
    eaten: Set<string>;
    pathIndex: number;
  }>({ body: [], eaten: new Set(), pathIndex: 0 });

  useEffect(() => {
    fetchSettings().then((s) => {
      const username = s.github_username || 'sicheng-svg';
      setGithubUsername(username);
      fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
        .then(res => res.json())
        .then((json: ContributionData) => {
          setData(json);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    });
  }, []);

  // 将 API 扁平日期数组按周分组
  const weeks = useMemo(() => {
    if (!data) return [];

    const result: (WeekCell | null)[][] = [];
    let currentWeek: (WeekCell | null)[] = [];

    const firstDate = new Date(data.contributions[0].date + 'T00:00:00');
    const firstDay = firstDate.getDay();

    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

    for (const contrib of data.contributions) {
      const date = new Date(contrib.date + 'T00:00:00');
      const day = date.getDay();

      currentWeek.push({
        date: contrib.date,
        count: contrib.count,
        level: contrib.level,
        day,
      });

      if (day === 6) {
        result.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      result.push(currentWeek);
    }

    return result;
  }, [data]);

  // 月份标签
  const monthLabels = useMemo(() => {
    if (!data) return [];

    const labels: { label: string; weekIndex: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;
    let weekIndex = 0;

    const firstDate = new Date(data.contributions[0].date + 'T00:00:00');
    const firstDay = firstDate.getDay();
    let dayCount = firstDay;

    for (const contrib of data.contributions) {
      const month = new Date(contrib.date + 'T00:00:00').getMonth();
      if (month !== lastMonth) {
        labels.push({ label: months[month], weekIndex });
        lastMonth = month;
      }
      dayCount++;
      if (dayCount % 7 === 0) {
        weekIndex++;
      }
    }

    return labels;
  }, [data]);

  // 预计算 zigzag 路径（仅包含有效格子）
  const snakePath = useMemo(() => {
    if (weeks.length === 0) return [];

    const path: { week: number; day: number }[] = [];

    for (let w = 0; w < weeks.length; w++) {
      if (w % 2 === 0) {
        // 偶数列：从上到下
        for (let d = 0; d < 7; d++) {
          if (d < weeks[w].length && weeks[w][d] != null) {
            path.push({ week: w, day: d });
          }
        }
      } else {
        // 奇数列：从下到上
        for (let d = 6; d >= 0; d--) {
          if (d < weeks[w].length && weeks[w][d] != null) {
            path.push({ week: w, day: d });
          }
        }
      }
    }

    return path;
  }, [weeks]);

  // 查询格子原始 level
  const getCellLevel = useCallback((weekIdx: number, dayIdx: number): number => {
    const cell = weeks[weekIdx]?.[dayIdx];
    return cell ? cell.level : 0;
  }, [weeks]);

  // 统计有贡献的格子总数
  const totalGreenCells = useMemo(() => {
    let count = 0;
    for (const week of weeks) {
      for (const cell of week) {
        if (cell && cell.level > 0) count++;
      }
    }
    return count;
  }, [weeks]);

  // 贪吃蛇动画
  useEffect(() => {
    if (snakePath.length === 0 || totalGreenCells === 0) return;

    const snake = snakeRef.current;
    // 从第一个格子出生
    snake.body = [snakePath[0]];
    snake.eaten = new Set();
    snake.pathIndex = 1;
    forceRender(n => n + 1);

    const interval = setInterval(() => {
      const s = snakeRef.current;

      // 循环路径
      const idx = s.pathIndex % snakePath.length;
      const pos = snakePath[idx];

      // 蛇头移到新位置
      s.body.push(pos);

      // 经典贪吃蛇：吃到绿色格子则变长，否则尾部缩短
      const key = `${pos.week}-${pos.day}`;
      const isFood = getCellLevel(pos.week, pos.day) > 0 && !s.eaten.has(key);

      if (isFood) {
        s.eaten.add(key);
      } else {
        // 没吃到食物，尾部缩短保持长度
        s.body.shift();
      }

      // 最大长度限制
      while (s.body.length > SNAKE_MAX_LENGTH) {
        s.body.shift();
      }

      s.pathIndex++;
      forceRender(n => n + 1);

      // 所有绿色格子都被吃完 → 重置
      if (s.eaten.size >= totalGreenCells) {
        clearInterval(interval);
        // 蛇消失
        setTimeout(() => {
          s.body = [];
          forceRender(n => n + 1);

          // 恢复所有格子原色，蛇重新开始
          setTimeout(() => {
            s.eaten = new Set();
            s.body = [];
            s.pathIndex = 0;
            forceRender(n => n + 1);
            setRestartKey(k => k + 1);
          }, RESET_DELAY);
        }, 300);
      }
    }, SNAKE_SPEED);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [snakePath, getCellLevel, restartKey, totalGreenCells]);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getLevelColor = (level: number) => {
    const colors = [
      '#161b22',
      '#0e4429',
      '#006d32',
      '#26a641',
      '#39d353'
    ];
    return colors[level] || colors[0];
  };

  const totalContributions = data
    ? Object.values(data.total).reduce((sum, n) => sum + n, 0)
    : 0;

  // 获取格子最终显示颜色
  const getCellColor = (weekIdx: number, dayIdx: number, cell: WeekCell | null): string => {
    if (!cell) return '#161b22';

    const key = `${weekIdx}-${dayIdx}`;
    const snake = snakeRef.current;

    // 蛇身
    if (snake.body.some(seg => seg.week === weekIdx && seg.day === dayIdx)) {
      return '#7c3aed';
    }

    // 已吃掉 → 变为底色
    if (snake.eaten.has(key)) {
      return '#161b22';
    }

    return getLevelColor(cell.level);
  };

  return (
    <div className="bg-[#0d1117] border border-gray-700 rounded-lg p-6 w-full max-w-fit mx-auto">
      <div className="mb-4">
        <h3 className="text-left text-white font-medium mb-2">
          贡献活动
          {data && (
            <span className="text-gray-500 text-sm font-normal ml-2">
              {totalContributions} contributions in the last year
            </span>
          )}
        </h3>
      </div>

      {loading ? (
        <div className="text-gray-500 text-sm py-8 text-center">加载中...</div>
      ) : (
        <div className="overflow-x-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div style={{ display: 'inline-block' }}>
            {/* Month labels */}
            <div
              className="relative"
              style={{ height: 16, marginLeft: 36, marginBottom: 4 }}
            >
              {monthLabels.map(({ label, weekIndex }, i) => (
                <span
                  key={`${label}-${i}`}
                  className="absolute text-xs text-gray-500"
                  style={{ left: weekIndex * CELL_STEP }}
                >
                  {label}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: CELL_GAP }}>
              {/* Day labels */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: CELL_GAP,
                  width: 30,
                  flexShrink: 0,
                }}
              >
                {dayLabels.map((day, i) => (
                  <div
                    key={day}
                    className="text-xs text-gray-500"
                    style={{
                      height: CELL_SIZE,
                      lineHeight: `${CELL_SIZE}px`,
                      fontSize: 10,
                    }}
                  >
                    {/* 只在 Mon(1), Wed(3), Fri(5) 显示文字 */}
                    {i % 2 === 1 ? day : ''}
                  </div>
                ))}
              </div>

              {/* Contribution grid */}
              <div style={{ display: 'flex', gap: CELL_GAP }}>
                {weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    style={{ display: 'flex', flexDirection: 'column', gap: CELL_GAP }}
                  >
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      const cell = week[dayIndex] ?? null;

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          style={{
                            width: CELL_SIZE,
                            height: CELL_SIZE,
                            borderRadius: 2,
                            backgroundColor: getCellColor(weekIndex, dayIndex, cell),
                            visibility: cell ? 'visible' : 'hidden',
                            cursor: 'pointer',
                          }}
                          title={
                            cell
                              ? `${cell.date}: ${cell.count} contribution${cell.count !== 1 ? 's' : ''}`
                              : ''
                          }
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div
              className="text-xs text-gray-500"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 4,
                marginTop: 8,
              }}
            >
              <span>Less</span>
              {[0, 1, 2, 3, 4].map(level => (
                <div
                  key={level}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    borderRadius: 2,
                    backgroundColor: getLevelColor(level),
                  }}
                />
              ))}
              <span>More</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
