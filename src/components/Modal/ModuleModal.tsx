import React from "react";

import { Modal } from "./";
import { Button, Input } from "../";

import { MODULE_DATA } from "../../shared/constants";
import { useAntToast, useCharacterSheet } from "../../shared/hooks";
import { useNavigate } from "react-router-dom";
import { ModuleOptions } from "../../shared/types";

import styles from "./ModuleModal.module.scss";

export type ModuleModalProps = {
	isOpen: boolean;
	setIsOpen: (arg0?: boolean) => void;
	className?: string;
	style?: React.CSSProperties;
};

export const ModuleModal = ({
	isOpen,
	setIsOpen,
	className,
	style,
}: ModuleModalProps) => {
	const {
		data: { getNewCharacterSheet, importSheet },
	} = useCharacterSheet();
	const { openToast } = useAntToast();
	const navigate = useNavigate();
	const sheetImportRef = React.useRef<HTMLTextAreaElement>(null);

	const closeModal = () => {
		setIsOpen(false);
	};

	const getModuleKey = (moduleName: string) => {
		const modulePair = Object.entries(MODULE_DATA).filter(
			([, data]) => data.NAME === moduleName
		);

		if (modulePair.length === 0) {
			return "";
		}

		return modulePair[0][0];
	};

	const handleNewCharacterSheet = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const { currentTarget } = event;

		const moduleName = currentTarget.chosenModule.value;

		const moduleKey = getModuleKey(moduleName);

		if (!moduleKey) {
			openToast("Módulo não encontrado");

			return;
		}

		const newSheet = getNewCharacterSheet(moduleKey as ModuleOptions);
		setIsOpen(false);
		currentTarget.reset();
		navigate(`/library/${newSheet.id}`);
	};

	const handleImportSheet = () => {
		const sheetCode = sheetImportRef?.current?.value;

		if (!sheetCode) {
			openToast("É necessário código de importação");
			return;
		}

		if (importSheet(sheetCode, sheetImportRef.current)) {
      setIsOpen(false);
    }
	};

	return (
		<Modal
			style={{ ...style }}
			isOpen={isOpen}
			setIsOpen={setIsOpen}
			className={className}
		>
			<form onSubmit={handleNewCharacterSheet}>
				<h2>Nova ficha</h2>
				<h3>Escolha o módulo da ficha</h3>
				<p>Depois de criada a ficha, o módulo não pode ser alterado</p>

				<datalist id="modulesList">
					{Object.values(MODULE_DATA).map((module, index) => (
						<option key={`${module.NAME}-${index}`} value={module.NAME}>
							{module.NAME}
						</option>
					))}
				</datalist>
				<Input
					title="Seletor módulo"
					name="chosenModule"
					type="text"
					required
					list="modulesList"
					placeholder="Nome módulo"
				/>
				<Button type="submit" onClick={() => {}}>
					Ok
				</Button>
			</form>
			<hr />

			<div className={styles.importContainer}>
				<p>Ou cole abaixo o código de uma ficha copiada para ser importada</p>
				<textarea title="Importação ficha" ref={sheetImportRef}></textarea>
				<Button type="button" onClick={handleImportSheet}>
					Importar
				</Button>
			</div>
		</Modal>
	);
};
