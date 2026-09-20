import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

# IEEE Style Configuration
plt.rcParams['font.family'] = 'serif'
plt.rcParams['font.serif'] = ['Times New Roman', 'DejaVu Serif', 'Liberation Serif', 'Times']
plt.rcParams['font.size'] = 9.0
plt.rcParams['axes.labelsize'] = 9.0
plt.rcParams['axes.titlesize'] = 9.5
plt.rcParams['xtick.labelsize'] = 8.0
plt.rcParams['ytick.labelsize'] = 8.0
plt.rcParams['legend.fontsize'] = 8.0
plt.rcParams['figure.autolayout'] = False

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "ieee_figures"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

METRICS = ["Integration", "Prediction", "Spatial Intel.", "Decision Supp."]

def generate_grouped_bar_chart(paper1_name, paper1_scores, paper2_name, paper2_scores, caption, note, filename_base):
    # IEEE single column width: 3.5 inches
    fig, ax = plt.subplots(figsize=(3.5, 2.7), dpi=300)
    
    x = np.arange(len(METRICS))
    width = 0.35

    rects1 = ax.bar(x - width/2, paper1_scores, width, label=paper1_name, color='#888888', edgecolor='black', linewidth=0.8, hatch='//')
    rects2 = ax.bar(x + width/2, paper2_scores, width, label=paper2_name, color='#111111', edgecolor='black', linewidth=0.8, hatch='\\\\')

    ax.set_ylabel("Score (0–5)", labelpad=4)
    ax.set_xticks(x)
    ax.set_xticklabels(METRICS, fontweight='normal')
    ax.set_ylim(0, 5.8)
    ax.set_yticks([0, 1, 2, 3, 4, 5])
    
    # Add values on top of bars
    for rect in rects1:
        height = rect.get_height()
        ax.annotate(f'{height}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 2),
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=7.5)

    for rect in rects2:
        height = rect.get_height()
        ax.annotate(f'{height}',
                    xy=(rect.get_x() + rect.get_width() / 2, height),
                    xytext=(0, 2),
                    textcoords="offset points",
                    ha='center', va='bottom', fontsize=7.5, fontweight='bold')

    ax.legend(loc='upper right', frameon=True, edgecolor='black', facecolor='white', framealpha=0.9)
    ax.grid(axis='y', linestyle=':', alpha=0.7, color='gray', linewidth=0.6)
    ax.set_axisbelow(True)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(0.8)
    ax.spines['bottom'].set_linewidth(0.8)

    plt.tight_layout()
    
    # Add caption and note below figure
    full_text = f"{caption}\n{note}"
    fig.text(0.5, 0.01, full_text, ha='center', fontsize=8.0, fontstyle='italic', wrap=True)
    plt.subplots_adjust(bottom=0.28)

    png_path = os.path.join(OUTPUT_DIR, f"{filename_base}.png")
    svg_path = os.path.join(OUTPUT_DIR, f"{filename_base}.svg")
    
    fig.savefig(png_path, dpi=300, bbox_inches='tight')
    fig.savefig(svg_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated {png_path} & {svg_path}")

# Figure 1: P1 vs P2
generate_grouped_bar_chart(
    paper1_name="P1",
    paper1_scores=[2, 5, 2, 2],
    paper2_name="P2",
    paper2_scores=[4, 3, 3, 3],
    caption="Fig. 2. Comparative analysis between P1 and P2.",
    note="Note: P2 improves data integration and coordination over P1, while P1 remains stronger in predictive analytics.",
    filename_base="fig2_p1_vs_p2"
)

# Figure 2: P2 vs P3
generate_grouped_bar_chart(
    paper1_name="P2",
    paper1_scores=[4, 3, 3, 3],
    paper2_name="P3",
    paper2_scores=[4, 3, 5, 4],
    caption="Fig. 3. Comparative analysis between P2 and P3.",
    note="Note: P3 significantly improves GIS and spatial intelligence capabilities.",
    filename_base="fig3_p2_vs_p3"
)

# Figure 3: P3 vs P4
generate_grouped_bar_chart(
    paper1_name="P3",
    paper1_scores=[4, 3, 5, 4],
    paper2_name="P4",
    paper2_scores=[4, 4, 3, 5],
    caption="Fig. 4. Comparative analysis between P3 and P4.",
    note="Note: P4 introduces explainable and transparent AI-driven decision support.",
    filename_base="fig4_p3_vs_p4"
)

# Figure 4: P4 vs Proposed
generate_grouped_bar_chart(
    paper1_name="P4",
    paper1_scores=[4, 4, 3, 5],
    paper2_name="Proposed",
    paper2_scores=[5, 5, 5, 5],
    caption="Fig. 5. Comparative analysis between P4 and the proposed system.",
    note="Note: The proposed system integrates interoperability, predictive analytics, GIS intelligence, and explainable decision support in a unified framework.",
    filename_base="fig5_p4_vs_proposed"
)

# Figure 5: Progressive Improvement Trend
def generate_trend_chart():
    fig, ax = plt.subplots(figsize=(3.5, 2.5), dpi=300)

    papers = ["P1", "P2", "P3", "P4", "Proposed"]
    capability_index = [2.8, 3.3, 4.0, 4.3, 5.0]

    ax.plot(papers, capability_index, color='black', linewidth=1.6, marker='o', markersize=5, markerfacecolor='black', markeredgecolor='black')
    
    for x, y in zip(papers, capability_index):
        ax.annotate(f"{y:.1f}", (x, y), textcoords="offset points", xytext=(0, 6), ha='center', fontsize=8, fontweight='bold')

    ax.set_ylabel("Overall Capability Index (0–5)", labelpad=4)
    ax.set_xlabel("Literature Progression Sequence", labelpad=4)
    ax.set_ylim(2.0, 5.5)
    ax.set_yticks([2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0])
    
    ax.grid(axis='y', linestyle=':', alpha=0.7, color='gray', linewidth=0.6)
    ax.set_axisbelow(True)

    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_linewidth(0.8)
    ax.spines['bottom'].set_linewidth(0.8)

    plt.tight_layout()
    fig.text(0.5, 0.01, "Fig. 6. Progressive improvement across the selected literature and the proposed system.", 
             ha='center', fontsize=8.0, fontstyle='italic', wrap=True)
    plt.subplots_adjust(bottom=0.22)

    png_path = os.path.join(OUTPUT_DIR, "fig6_progressive_trend.png")
    svg_path = os.path.join(OUTPUT_DIR, "fig6_progressive_trend.svg")
    fig.savefig(png_path, dpi=300, bbox_inches='tight')
    fig.savefig(svg_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated {png_path} & {svg_path}")

generate_trend_chart()

# Figure 6: Final Overall Comparison (Radar Chart for all 5 papers)
def generate_final_radar_chart():
    fig, ax = plt.subplots(figsize=(3.5, 3.4), subplot_kw=dict(polar=True), dpi=300)
    
    axes_labels = ['Integration', 'Prediction', 'Spatial Intel.', 'Explainability', 'Recommendation', 'Optimization']
    N = len(axes_labels)

    angles = [n / float(N) * 2 * np.pi for n in range(N)]
    angles += angles[:1]

    # Paper profiles
    p1 = [2, 5, 2, 1, 2, 2]; p1 += p1[:1]
    p2 = [4, 3, 3, 1, 2, 2]; p2 += p2[:1]
    p3 = [4, 3, 5, 1, 3, 3]; p3 += p3[:1]
    p4 = [4, 4, 3, 5, 3, 2]; p4 += p4[:1]
    prop = [5, 5, 5, 5, 5, 5]; prop += prop[:1]

    plt.xticks(angles[:-1], axes_labels, size=7.5)
    ax.set_rlabel_position(0)
    plt.yticks([1, 2, 3, 4, 5], ["1", "2", "3", "4", "5"], color="gray", size=6.5)
    plt.ylim(0, 5.2)

    # Plot lines
    ax.plot(angles, p1, linewidth=1.0, linestyle=':', color='#999999', label='P1', marker='v', markersize=3)
    ax.plot(angles, p2, linewidth=1.0, linestyle='--', color='#777777', label='P2', marker='^', markersize=3)
    ax.plot(angles, p3, linewidth=1.1, linestyle='-.', color='#555555', label='P3', marker='d', markersize=3)
    ax.plot(angles, p4, linewidth=1.2, linestyle='--', color='#333333', label='P4', marker='s', markersize=3.5)
    
    # Highlight Proposed with thick black outline
    ax.plot(angles, prop, linewidth=2.2, linestyle='-', color='#000000', label='Proposed Platform', marker='o', markersize=4.5)
    ax.fill(angles, prop, color='#222222', alpha=0.10)

    ax.legend(loc='upper right', bbox_to_anchor=(1.32, 1.15), frameon=True, edgecolor='black', facecolor='white', fontsize=7.0)
    
    plt.tight_layout()
    fig.text(0.5, 0.01, "Fig. 7. Overall comparison of the selected base papers and the proposed Smart City AI platform.", 
             ha='center', fontsize=8.0, fontstyle='italic', wrap=True)
    plt.subplots_adjust(bottom=0.18)

    png_path = os.path.join(OUTPUT_DIR, "fig7_overall_comparison.png")
    svg_path = os.path.join(OUTPUT_DIR, "fig7_overall_comparison.svg")
    fig.savefig(png_path, dpi=300, bbox_inches='tight')
    fig.savefig(svg_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Generated {png_path} & {svg_path}")

generate_final_radar_chart()

print("All 6 sequential literature progression figures successfully generated.")
