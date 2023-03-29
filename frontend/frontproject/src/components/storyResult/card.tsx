import styles from "../../assets/css/libraryPage.module.css";

export interface CardProps {
	imageSrc: string;
	title: string;
	id: number;
}

const Card = (props: CardProps) => {
	return (
		// 카드
		<article className={styles.item_box}>
			{/* 이미지 */}
			<img className={styles.image} src={props.imageSrc} alt="storyImg" />
			{/* 제목 */}
			<h1 className={styles.title}>{props.title}</h1>
		</article>
		// </div>
	);
};

export default Card;